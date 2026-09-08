import {
  CallRequestResultEvent,
  CheckBeforeCallResult,
  IncomingCallInfo,
  MeetingContextType,
  OutgoingCallInfo,
  OutgoingCallResult,
  OutgoingCallTargetUser,
  ReceiveCallEvent,
} from "@/types/meetingTypes";
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { toast } from "react-toastify";
import { create } from "zustand";

type MeetingStore = MeetingContextType & {
  sessionId?: string;
  accessToken?: string;
};

// Module scope: hot reload'da persist kalır
let _connection: HubConnection | null = null;

export const useMeetingStore = create<MeetingStore>((set) => ({
  connection: null,
  connectionStatus: "disconnected",
  activeMeetingId: null, // aktif toplantı id'si. buna göre toplantı ekranına yönlendirme yapılacak.
  shouldNavigateToMeeting: false, // meeting ekranına yönlendirme flag'ı
  isClientInMeeting: false, // şuanda toplantıda mı
  activeCallRequest: null, // şuanda yapılan arama var mı
  incomingCall: null, // şuanda gelen arama var mı
  connect: async (accessToken: string, sessionId: string) => {
    try {
      // Mevcut connection varsa ve canlıysa:
      // - development: hot reload kaynaklı stale listener riskine karşı listeners'ı yenile
      // - production: mevcut connection'ı olduğu gibi kullan
      if (_connection && _connection.state === HubConnectionState.Connected) {
        if (process.env.NODE_ENV === "development") {
          console.log("Connection already active (dev), updating listeners...");
          removeListeners(_connection);
          registerListeners(_connection);
        }
        set({ connection: _connection, connectionStatus: "connected" });
        return;
      } else if (
        _connection &&
        (_connection.state === HubConnectionState.Connecting || _connection.state === HubConnectionState.Reconnecting)
      ) {
        set({
          connection: _connection,
          connectionStatus: _connection.state === HubConnectionState.Reconnecting ? "reconnecting" : "connecting",
        });
        return;
      } else if (_connection && _connection.state === HubConnectionState.Disconnected) {
        console.log("Existing meeting connection found in disconnected state. Attempting to reconnect...");
        try {
          set({ connectionStatus: "connecting" });
          await _connection.start();
          set({ connection: _connection, connectionStatus: "connected" });
          console.log("Reconnected to meeting hub.");
          return;
        } catch (err) {
          console.warn("Reconnection attempt failed, will create new connection:", err);
          await cleanupConnection();
        }
      }

      // Ölü/stale connection'ı cleanup et
      if (_connection) {
        await cleanupConnection();
      }

      console.log("Connecting to meeting hub..");
      set({ connectionStatus: "connecting" });
      const connection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_MEETING_HUB}?sessionid=${sessionId}`, {
          accessTokenFactory: () => accessToken,
          headers: {
            sessionid: sessionId,
          },
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Error)
        .build();

      connection.serverTimeoutInMilliseconds = 30000;
      connection.keepAliveIntervalInMilliseconds = 15000;

      // Module scope'da kaydet
      _connection = connection;

      // Register listeners
      registerListeners(connection);

      connection.onclose((error) => {
        set({ connectionStatus: "disconnected" });
        if (error) console.error("Meeting connection closed with error:", error);
      });

      connection.onreconnecting(() => {
        set({ connectionStatus: "reconnecting" });
        console.log("Meeting connection lost. Attempting to reconnect...");
      });

      connection.onreconnected(() => {
        set({ connectionStatus: "connected" });
        console.log("Reconnected to meeting server.");
      });

      await connection.start();
      set({ connection, connectionStatus: "connected" });
      console.log("Meeting hub connected.");
    } catch (error) {
      console.error("Error connecting to meeting:", error);
      set({ connectionStatus: "disconnected" });
    }
  },
  disconnect: async () => {
    if (!_connection) return;

    await cleanupConnection();

    set({
      connection: null,
      connectionStatus: "disconnected",
      activeMeetingId: null,
      shouldNavigateToMeeting: false,
      isClientInMeeting: false,
      activeCallRequest: null,
      incomingCall: null,
    });
    console.log("Meeting hub disconnected");
  },
  isUserOnline: async (userId: string): Promise<boolean> => {
    try {
      const connection = useMeetingStore.getState().connection;
      if (connection && connection.state === HubConnectionState.Connected) {
        return await connection.invoke("IsUserOnline", userId);
      } else {
        console.warn("Cannot check user online status: Not connected to meeting hub.");
        return false;
      }
    } catch (error) {
      console.error("Error checking user online status:", error);
      return false;
    }
  },
  acceptCall: async (): Promise<void> => {
    const connection = useMeetingStore.getState().connection;
    const incomingCall = useMeetingStore.getState().incomingCall;

    if (!incomingCall) {
      console.warn("No incoming call to accept.");
      return;
    }

    try {
      if (connection && connection.state === HubConnectionState.Connected) {
        await connection.invoke("AcceptInstantCall", incomingCall.id);

        // kullanıcı sonucu görsün
        set((state) => ({
          incomingCall: { ...state.incomingCall, callStatus: "ACCEPTED" } as IncomingCallInfo,
        }));

        // kısa bir beklemden sonra sayfaya gitsin. backend işlemleri de tamamlanması garanti olsun.
        setTimeout(() => {
          set({
            incomingCall: null,
            isClientInMeeting: true,
            activeMeetingId: incomingCall.id,
            shouldNavigateToMeeting: true,
          });
        }, 500);
      } else {
        throw new Error("Cannot accept call: Not connected to meeting hub.");
      }
    } catch (error) {
      set({
        incomingCall: null,
        shouldNavigateToMeeting: false,
        activeMeetingId: null,
        isClientInMeeting: false,
      });
      console.error("Error accepting call:", error);
    }
  },
  rejectCall: async (): Promise<void> => {
    const connection = useMeetingStore.getState().connection;
    const incomingCall = useMeetingStore.getState().incomingCall;

    if (!incomingCall) {
      console.warn("No incoming call to reject.");
      return;
    }

    try {
      if (connection && connection.state === HubConnectionState.Connected) {
        await connection.invoke("DeclineInstantCall", incomingCall.id);
        set({ incomingCall: null });
      }
    } catch (error) {
      console.error("Error rejecting call:", error);
    }
  },
  setClientInMeeting: (fallbackMeetingId?: string | null) => { 
    // inMeeting: true
    const { connection, activeMeetingId, isClientInMeeting } = useMeetingStore.getState();
    let usingMeetingId = activeMeetingId;

    if (!activeMeetingId){
      if(fallbackMeetingId){
        usingMeetingId = fallbackMeetingId;
        set({ activeMeetingId: fallbackMeetingId });
      }else{
        console.warn("Cannot set client in meeting: No active meeting ID available.")
        return;
      }
    }

    if (connection?.state === HubConnectionState.Connected) {
      // call kabul edilince direkt true oluyor aslında, o yüzden toplantı ekranına girince sadece istek atsın diye.
      if(!isClientInMeeting)
        set({ isClientInMeeting: true });

      connection.invoke("SetClientInMeeting", usingMeetingId).catch((e) => {
        console.warn("SetClientInMeeting error:", e);
      });
    }
  },
  leaveMeeting: () => {
    // Önce state'i güncelle (useCallNavigation tekrar tetiklenmesin)
    set({
      isClientInMeeting: false,
      activeMeetingId: null,
      shouldNavigateToMeeting: false,
    });

    // Sonra sunucuya bildir (fire and forget, kullanıcıyı beklettirme)
    const connection = useMeetingStore.getState().connection;
    if (connection?.state === HubConnectionState.Connected) {
      connection.invoke("SetClientExitMeeting").catch((e) => {
        console.warn("SetClientExitMeeting error:", e);
      });
    }
  },
  checkBeforeInstantCall: async (targetUserId: string): Promise<CheckBeforeCallResult> => {
    const connection = useMeetingStore.getState().connection;
    try {
      if (connection && connection.state === HubConnectionState.Connected) {
        return await connection.invoke("CheckBeforeInstantCall", targetUserId);
      }
      return { status: "UserCannotCalled", message: "Error checking call eligibility." };
    } catch (error) {
      console.error("Error checking before instant call:", error);
      return { status: "UserCannotCalled", message: "Error checking call eligibility." };
    }
  },
  makeInstantCall: async (targetUser: OutgoingCallTargetUser): Promise<void> => {
    const connection = useMeetingStore.getState().connection;
    const hasCallRequest = useMeetingStore.getState().activeCallRequest;

    if (hasCallRequest) {
      toast.info("You already have an active call request. Please wait for it to be accepted or rejected before making another call.")
      return;
    }

    try {
      if (connection && connection.state === HubConnectionState.Connected) {
        set({
          activeCallRequest: {
            targetUser: targetUser,
            targetUserId: targetUser.id,
            preCheck: { status: "IN_PROGRESS" },
            call: { status: "IDLE", state: "Preparing" },
          },
        });

        const checkStatus = await useMeetingStore.getState().checkBeforeInstantCall(targetUser.id);

        if (checkStatus.status === "Success") {
          set((state) => ({
            activeCallRequest: state.activeCallRequest
              ? ({
                  ...state.activeCallRequest,
                  preCheck: { status: "COMPLETED", result: checkStatus },
                  call: { status: "IN_PROGRESS", startTime: new Date().toISOString(), state: "Preparing" },
                } as OutgoingCallInfo)
              : null,
          }));

          const result: OutgoingCallResult = await connection.invoke("SendInstantCall", targetUser.id);

          if (!result.success) {
            set((state) => ({
              activeCallRequest: state.activeCallRequest
                ? {
                    ...state.activeCallRequest,
                    call: { status: "FAILED", endTime: new Date().toISOString(), state: result.error || "Failed" },
                  }
                : null,
            }));

            return; // görüşmeyi bitir
          }

          // herhangi bir exception olmadan işlem devam ederse sonucu güncelle.
          set((state) => ({
            activeCallRequest: state.activeCallRequest
              ? {
                  ...state.activeCallRequest,
                  call: {
                    ...state.activeCallRequest.call,
                    state: "Ringing",
                    id: result.callId,
                    startTime: result.startedAt || new Date().toISOString(),
                    timeOut: result.timeOut,
                  },
                }
              : null,
          }));
        } else {
          // ön kontrol başarısız ise kullanıcıya bildir ve çağrı isteğini temizle
          set((state) => ({
            activeCallRequest: state.activeCallRequest
              ? {
                  ...state.activeCallRequest,
                  preCheck: {
                    status: "FAILED",
                    result: checkStatus,
                    ongoingMeetingId: checkStatus.status === "UserInContinueMeeting" ? checkStatus.message : null,
                  },
                  call: { status: "COMPLETED", state: "Failed" },
                }
              : null,
          }));
        }
      }
    } catch (error) {
      // arama hatası durumunda da çağrı isteğini temizle
      set((state) => ({
        activeCallRequest: state.activeCallRequest
          ? ({
              ...state.activeCallRequest,
              preCheck: { status: "FAILED", result: undefined },
              call: { status: "FAILED", endTime: new Date().toISOString(), state: "Failed" },
            } as OutgoingCallInfo)
          : null,
      }));
      console.error("Error making instant call:", error);
    }
  },
  closeCall: () => {
    set({ activeCallRequest: null });
  },
  cancelCallRequest: () => {
    const connection = useMeetingStore.getState().connection;
    const activeCallRequest = useMeetingStore.getState().activeCallRequest;

    if (!activeCallRequest) {
      console.warn("No active call request to cancel.");
      return;
    }

    if (connection && connection.state === HubConnectionState.Connected) {
      connection.invoke("CancelInstantCall", activeCallRequest.call.id);
      set({ activeCallRequest: null });
    }
  },
  joinOngoingMeeting: (meetingId: string) => {
    set({
      incomingCall: null,
      activeCallRequest: null,
      isClientInMeeting: true,
      activeMeetingId: meetingId,
      shouldNavigateToMeeting: true,
    });
  },
  sendMessageToMeetingGroup: async (message: string) => {
    console.warn("Arama sohbetine mesaj gönderme şuan çalışmıyor.. hubda var ama aktif değil. kullanılan yerler var diye metodunu ekledim.")
  }
}));

const removeListeners = (connection: HubConnection) => {
  console.log("Removing meeting listeners...");
  connection.off("ReceiveCall");
  connection.off("CallRequestResult");
  connection.off("CallMissed");
  connection.off("CallAcceptedByOtherClient");
  connection.off("Ping");
};

const cleanupConnection = async () => {
  const connection = _connection;
  if (!connection) return;

  removeListeners(connection);

  if (connection.state !== HubConnectionState.Disconnected) {
    try {
      await connection.stop();
    } catch (err) {
      console.warn("Error stopping previous connection:", err);
    }
  }

  _connection = null;
};

const registerListeners = (connection: HubConnection) => {
  console.log("Registering meeting listeners...");

  connection.on("ReceiveCall", async (result: ReceiveCallEvent) => {
    const isClientInMeeting = useMeetingStore.getState().isClientInMeeting;
    if (isClientInMeeting) return;

    const { activeCallRequest: hasActiveCallRequest, incomingCall } = useMeetingStore.getState();

    if (!hasActiveCallRequest && !incomingCall) {
      useMeetingStore.setState({
        incomingCall: {
          id: result.callId,
          user: result.caller,
          userId: result.caller.id,
          callStatus: "PENDING",
          startedAt: result.startedAt,
          timeOut: result.timeOut,
        },
      });
      return;
    }

    let mustDecline = false;

    if (hasActiveCallRequest && !incomingCall) {
      if (
        (hasActiveCallRequest?.preCheck.status === "COMPLETED" || hasActiveCallRequest?.preCheck.status === "FAILED") &&
        (hasActiveCallRequest?.call.status === "COMPLETED" || hasActiveCallRequest?.call.status === "FAILED")
      ) {
        useMeetingStore.setState({
          activeCallRequest: null,
          incomingCall: {
            id: result.callId,
            user: result.caller,
            userId: result.caller.id,
            callStatus: "PENDING",
            startedAt: result.startedAt,
            timeOut: result.timeOut,
          },
        });
      } else {
        mustDecline = true;
      }
    } else if (incomingCall && !hasActiveCallRequest) {
      if (incomingCall.callStatus !== "PENDING") {
        useMeetingStore.setState({ incomingCall: null });
        useMeetingStore.setState({
          incomingCall: {
            id: result.callId,
            user: result.caller,
            userId: result.caller.id,
            callStatus: "PENDING",
            startedAt: result.startedAt,
            timeOut: result.timeOut,
          },
        });
      } else {
        mustDecline = true;
      }
    }

    if (mustDecline) {
      await connection.invoke("DeclineInstantCallAsBusy", result.callId);
      toast.info(`The call from ${result.caller.firstName} ${result.caller.lastName} was rejected because you are on another call.`);
    }
  });

  connection.on("CallRequestResult", (result: CallRequestResultEvent) => {
    if (useMeetingStore.getState().isClientInMeeting) return;

    const { activeCallRequest } = useMeetingStore.getState();
    if (!activeCallRequest) return;

    if (activeCallRequest.call.id !== result.callId) {
      console.warn("Received CallRequestResult for unknown callId:", result.callId);
      return;
    }

    // sonuç ne olursa olsun güncelle, kullanıcı ekranda görsün. Kabul edilse de, reddedilse de veya zaman aşımına uğrasa da sonucu göstermek önemli.
    useMeetingStore.setState({
      activeCallRequest: {
        ...activeCallRequest,
        call: { ...activeCallRequest.call, state: result.status, endTime: new Date().toISOString(), status: "COMPLETED" },
      } as OutgoingCallInfo,
    });

    // eğer sonuç "Accepted" ise toplantı ekranına yönlendir. kısa bir bekleme koyuyoruzki backendde işlemlerin tamamlanması garanti olsun.
    if (result.status === "Accepted") {
      setTimeout(() => {
        useMeetingStore.setState({
          isClientInMeeting: true,
          activeMeetingId: result.callId,
          shouldNavigateToMeeting: true,
          activeCallRequest: null,
        });
      }, 500);
    }
  });

  connection.on("CallMissed", (callId: string) => {
    console.log("📴 Call missed event received for callId:", callId);
    const incomingCall = useMeetingStore.getState().incomingCall;
    const isClientInMeeting = useMeetingStore.getState().isClientInMeeting;

    if (isClientInMeeting || !incomingCall || incomingCall.id !== callId) return;

    toast.info(`You missed a call from ${incomingCall.user.firstName} ${incomingCall.user.lastName}.`, {autoClose: false});
    useMeetingStore.setState({ incomingCall: null });
  });

  connection.on("CallAcceptedByOtherClient", (callId: string) => {
    const incomingCall = useMeetingStore.getState().incomingCall;
    const isClientInMeeting = useMeetingStore.getState().isClientInMeeting;

    if (isClientInMeeting || !incomingCall || incomingCall.id !== callId) return;

    toast.info(`Your meeting request with ${incomingCall.user.firstName} ${incomingCall.user.lastName} was accepted on another device.`, {autoClose: false});

    useMeetingStore.setState({ incomingCall: null });
  });

  connection.on("Ping", () => connection.invoke("Pong"));

  console.log("Meeting listeners registered successfully");
};
