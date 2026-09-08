"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { toast } from "react-toastify";
import client from "@/utils/client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSignalR } from "./SignalRContext2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faTimes } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";

let globalConnection = null;
const MeetingContext = createContext();

export const useMeetingContext = () => useContext(MeetingContext);

const initialState = {
  connection: null,
  calledUser: null, // aranılan kullanıcı
  callResult: false, // çağrı sonucu
  incomingCall: null, // gelen ve henüz yanıtlanmamış çağrı   { user, callStatus [Calling || Accepted || Declined || Timeout] }
  isClientInMeeting: false, // kullanıcı toplantı ekranındayken bunu aktif yapıcaz
  missedCallUser: null, // kullanıcının cevaplamadığı çağrı
  unacceptableUser: null, // başka biri aradığı için kabul edilemeyen çağrı
  meetingId: null, // kabul edilen toplantı id'si,
};

const MySwal = withReactContent(Swal);

export const MeetingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const hasIncomingCall = useRef(false);
  const hasCallRequest = useRef(false);
  const isClientInMeetingRef = useRef(false);
  const ringtoneAudio = useRef(null);

  const { getQuickChatUser } = useSignalR();

  useEffect(() => {
    // Eğer zaten global connection varsa yeni connection açma
    if (globalConnection && globalConnection.state !== "Disconnected") {
      dispatch({ type: "SET_CONNECTION", payload: globalConnection });
      return;
    }

    const connect = new signalR.HubConnectionBuilder()
      .withUrl(
        `${process.env.NEXT_PUBLIC_MEETING_HUB}?sessionid=${Cookies.get("sessionId")}`, 
        {
          accessTokenFactory: () => Cookies.get("accessToken"),
          headers: {
            sessionid: Cookies.get("sessionId"),
          },
        },
      )
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Error)
      .build();

    connect.serverTimeoutInMilliseconds = 30000;
    connect.keepAliveIntervalInMilliseconds = 15000;

    connect.start().then(async () => {
      globalConnection = connect;
      dispatch({ type: "SET_CONNECTION", payload: connect });

      connect.on("InstantCallMissed", async (user) => {
        if (isClientInMeetingRef.current) return;

        dispatch({ type: "HANDLE_MISSED_CALL", payload: user });
        if (!hasIncomingCall.current && !hasCallRequest.current) {
          const modalResult = await MySwal.fire({
            title: "Missing Call",
            text: `You have a missing call from ${user.name}`,
            icon: "info",
            showConfirmButton: true,
            confirmButtonText: "Ok",
            showCancelButton: false,
          });

          if (modalResult.isDismissed || modalResult.isConfirmed) {
            clearMissingCall();
          }
        } else {
          toast.info(`The call from ${user.name} was missed.`);
        }

        hasIncomingCall.current = false;
      });

      connect.on("InstantCallAccepted", joinMeeting);

      connect.on("InstantCallAcceptedByOtherClient", async () => {
        if (isClientInMeetingRef.current) return;

        toast.info("The call was accepted by another client.");
        dispatch({ type: "INSTANT_CALL_ACCEPTED_BY_OTHER_CLIENT" });
        MySwal.close();
        hasIncomingCall.current = false;
      });

      connect.on("Ping", () => {
        connect.invoke("Pong").catch((err) => console.error(err.toString()));
      });
    });

    return () => {
      connect.off("InstantCallMissed");
      connect.off("InstantCallAccepted");
      connect.off("InstantCallAcceptedByOtherClient");
      connect.off("Ping");
      connect
        .stop()
        .catch((err) => console.error("SignalR disconnect error:", err));
    };
  }, []);

  useEffect(() => {
    const handleMissedCall = async () => {
      const modalResult = await MySwal.fire({
        title: "Missing Call",
        text: `You have a missing call from ${state.missedCallUser.name}`,
        icon: "info",
        showConfirmButton: true,
        confirmButtonText: "Ok",
        showCancelButton: false,
      });

      if (modalResult.isDismissed || modalResult.isConfirmed)
        dispatch({ type: "CLEAR_MISSED_CALL" });
    };

    if (state.missedCallUser) {
      handleMissedCall();
    }
  }, [state.missedCallUser]);

  useEffect(() => {
    if (state.incomingCall && !state.isClientInMeeting) {
      if (!ringtoneAudio.current) {
        ringtoneAudio.current = new Audio("/incoming-call-sound/ringtone.mp3");
        ringtoneAudio.current.loop = true;
        ringtoneAudio.current
          .play()
          .catch((err) => console.error("Error playing ringtone:", err));
      }

      MySwal.fire({
        html: <IncomingCallModal incomingCall={state.incomingCall} />,
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
      });
    } else {
      if (ringtoneAudio.current) {
        ringtoneAudio.current.pause();
        ringtoneAudio.current.currentTime = 0;
        ringtoneAudio.current = null;
      }
    }

    const handleReceiveCall = async (invitation) => {
      if (state.isClientInMeeting) return;

      const callingUser = await getUser(invitation.fromUserId);
      if (state.incomingCall || state.calledUser) {
        await state.connection.invoke(
          "PostponeInstantCall",
          invitation.fromUserId,
          invitation.fromConnectionId,
        );
        toast.info(
          `The call from ${callingUser?.firstName} ${callingUser?.lastName} was rejected because you are on another call.`,
        );
        dispatch({ type: "SET_UNACCEPTABLE_USER", payload: callingUser });
      } else {
        dispatch({
          type: "SET_INSTANT_MEETING_REQUEST",
          payload: { user: callingUser, invitation },
        });
      }
    };

    if (state.connection && state.connection.state === "Connected") {
      state.connection.on("ReceiveInstantCall", handleReceiveCall);
    }

    return () => {
      if (state.connection) {
        state.connection.off("ReceiveInstantCall");
      }
      // Clean up ringtone on unmount
      if (ringtoneAudio.current) {
        ringtoneAudio.current.pause();
        ringtoneAudio.current = null;
      }
    };
  }, [
    state.connection,
    state.incomingCall,
    state.calledUser,
    state.isClientInMeeting,
  ]);

  const handleInstanMeetingResult = useCallback(
    async (status, secondaryData) => {
      if (ringtoneAudio.current) {
        ringtoneAudio.current.pause();
        ringtoneAudio.current.currentTime = 0;
        ringtoneAudio.current = null;
      }
      await MySwal.close();
      if (status === "Declined") {
        await MySwal.fire({
          title: "Call Declined",
          text: "User declined your call request.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      } else if (status === "Accepted") {
        await MySwal.fire({
          title: "Call Accepted",
          text: "User accepted your call request. Please wait...",
          icon: "success",
          showCancelButton: false,
          showConfirmButton: false,
          didOpen: () => {
            MySwal.showLoading();
          },
        });
      } else if (status === "Timeout") {
        await MySwal.fire({
          title: "Call Failed",
          text: "User cannot answering your call right now.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      } else if (status === "UserOffline") {
        const offlineModal = await MySwal.fire({
          title: `${state.calledUser?.firstName} ${state.calledUser?.lastName}`,
          text: "is offline now. You may contact the user by sending a message.",
          icon: "warning",
          confirmButtonText: "Send Message",
          confirmButtonColor: "#7CB342",
          showCancelButton: true,
        });

        if (offlineModal.isConfirmed) getQuickChatUser(state.calledUser.id);
      } else if (status === "YouAreInAnotherCall") {
        await MySwal.fire({
          title: "Call Failed",
          text: "You have another call request right now. Please try again later.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      } else if (status === "InAnotherCall") {
        await MySwal.fire({
          title: "Call Failed",
          text: "User is in another call right now. Please try again later.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      } else if (status === "UserInContinueMeeting") {
        var result = await MySwal.fire({
          title: "Another Meeting Continues",
          text: "An ongoing meeting with the user is in progress. Please click the join button to participate.",
          icon: "info",
          confirmButtonText: "Join Meeting",
          showCancelButton: true,
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          joinMeeting(secondaryData);
        }
      } else if (status === "UserCannotCalled") {
        await MySwal.fire({
          title: "Call Failed",
          text: secondaryData,
          icon: "error",
          confirmButtonText: "Okay",
        });
      } else {
        await MySwal.fire({
          title: "Call Failed",
          text: "Please try again later.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }

      hasCallRequest.current = false;
      dispatch({ type: "SET_CALLED_USER", payload: null });
      dispatch({ type: "SET_CALL_RESULT", payload: null });
    },
    [state.calledUser, getQuickChatUser],
  );

  useEffect(() => {
    if (state.calledUser && state.callResult) {
      handleInstanMeetingResult(
        state.callResult.result,
        state.callResult.secondaryData,
      );
    }
  }, [state.calledUser, state.callResult, handleInstanMeetingResult]);

  const acceptInstantCall = useCallback(async () => {
    if (ringtoneAudio.current) {
      ringtoneAudio.current.pause();
      ringtoneAudio.current = null;
    }
    await state.connection.invoke(
      "AcceptInstantCall",
      state.incomingCall.user.fromUserId,
      state.incomingCall.user.fromConnectionId,
    );
    dispatch({ type: "ACCEPT_INSTANT_CALL" });
  }, [state.connection, state.incomingCall]);

  const declineInstantCall = useCallback(async () => {
    if (ringtoneAudio.current) {
      ringtoneAudio.current.pause();
      ringtoneAudio.current = null;
    }
    await state.connection.invoke(
      "DeclineInstantCall",
      state.incomingCall.user.fromUserId,
    );
    dispatch({ type: "DECLINE_INSTANT_CALL" });
    MySwal.close();
    hasIncomingCall.current = false;
  }, [state.connection, state.incomingCall]);

  const handleCancelCall = useCallback(async () => {
    if (state.connection) {
      Swal.close();
      state.connection.invoke("CancelInstantCall");
    }
  }, [state.connection]);

  const makeInstantCall = async (userId) => {
    hasCallRequest.current = true;

    MySwal.fire({
      icon: "info",
      title: "Checking User...",
      text: "Please wait...",
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        MySwal.showLoading();
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const user = await getUser(userId);
      if (!user) {
        MySwal.update({
          text: "Cannot get user data right now",
          showCancelButton: true,
        });
        return;
      }

      dispatch({ type: "SET_CALLED_USER", payload: user });

      const checkStatus = await checkBeforeInstantCall(userId);

      if (checkStatus.status !== "Success") {
        dispatch({
          type: "SET_CALL_RESULT",
          payload: {
            result: checkStatus.status,
            secondaryData: checkStatus.message,
          },
        });
        return;
      }

      let description = "Click the below call button to start a live call.";
      if (user.status === 2) {
        description =
          "It's not available right now. Would you like to call anyway?";
      } else if (user.status === 3) {
        description =
          "is in a meeting right now. You may contact the user by sending a message.";
      } else if (user.status === 4) {
        description =
          "is offline now. You may contact the user by sending a message.";
      }

      const html = `
                <div class="row justify-content-center mb-2">
                    <h4>Let’s Talk!</h4>
                    <div class="call-profile-picture">
                        <img src="${user.imageUrl || "/images/empty-image.png"}">
                    </div>
                </div>
                <div class="row">
                    <h4 class="call-modal-user-fullname">${user.fistName} ${user.lastName}</h4>
                    ${
                      user.jobTitle
                        ? `<p class="call-modal-category mb-2">${user.jobTitle}</p>`
                        : ""
                    }
                    <p>Click the below call button to start a live call.</p>
                </div>
            `;

      const callModal = await MySwal.fire({
        title: user.status !== 1 && `${user.firstName} ${user.lastName}`,
        text: description,
        html: user.status === 1 ? html : "",
        icon: user.status === 1 ? null : "warning",
        showCancelButton: true,
        confirmButtonText: (
          <>
            <FontAwesomeIcon icon={faPhone} size="18" /> Call
          </>
        ),
        confirmButtonColor: "#7CB342",
      });

      if (callModal.isConfirmed) {
        showCallingModal(userId, user.firstName, user.lastName);
        if (!ringtoneAudio.current) {
          ringtoneAudio.current = new Audio(
            "/incoming-call-sound/ringtone.mp3",
          );
          ringtoneAudio.current.loop = true;
          ringtoneAudio.current
            .play()
            .catch((err) => console.error("Error playing ringtone:", err));
        }
      } else dispatch({ type: "SET_CALLED_USER", payload: null });
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error invoking SendInstantCall:", error);

      // Close the current modal in case of an error
      MySwal.close();

      // Show an error modal with a specific error message
      MySwal.fire({
        title: "Error",
        text: "An error occurred while trying to make the call.",
        icon: "error",
        confirmButtonText: "Okay",
      });
      dispatch({ type: "SET_CALLED_USER", payload: null });
    }
  };

  const showCallingModal = useCallback(
    async (userId, firstName, lastName) => {
      const CallModalHtml = () => {
        return (
          <>
            <Image
              src="/images/calling.gif"
              width={250}
              height={250}
              alt="calling.gif"
            />
            <div className="swal2-html-container">
              <p>
                Calling <b>{`${firstName} ${lastName}`}</b>
              </p>
              <button className="btn btn-danger" onClick={handleCancelCall}>
                Cancel
              </button>
            </div>
          </>
        );
      };

      MySwal.fire({
        title: "Calling...",
        html: <CallModalHtml />,
        customClass: {
          icon: "no-frame-icon", // Add custom class for the icon
        },
        showCancelButton: false,
        showConfirmButton: false,
        cancelButtonColor: "#FF0000",
      });

      const result = await state.connection.invoke("SendInstantCall", userId);
      dispatch({
        type: "SET_CALL_RESULT",
        payload: { result: result, secondaryData: null },
      });
    },
    [state.connection, handleCancelCall],
  );

  const IncomingCallModal = ({ incomingCall }) => {
    const user = incomingCall?.user;
    const callAccepted = incomingCall?.callStatus === "ACCEPTED";

    return (
      <>
        <h4>Let’s Talk!</h4>
        <div className="mb-3 live-call-border"></div>
        <div className="call-modal-user-content">
          <div className="row justify-content-center mb-2">
            <div className="call-profile-picture">
              <img src={user?.imageUrl || "/images/empty-image.png"} />
            </div>
          </div>
          <div className="row">
            <h4 className="call-modal-user-fullname">
              {user?.firstName} {user?.lastName}
            </h4>
            <h5>{user?.companyName}</h5>
            <p className="call-warning">
              {callAccepted ? "Getting Meeting Data..." : "Incoming Call"}
            </p>
          </div>
          <div className="row justify-content-center">
            {callAccepted ? (
              <div className="col-auto">
                <CircularProgress />
              </div>
            ) : (
              <>
                <div className="col-auto">
                  <button
                    className="call-answer-btn accept mb-2"
                    onClick={acceptInstantCall}
                    title="Accept Call"
                  >
                    <FontAwesomeIcon icon={faPhone} color="white" />
                    <i className="fa fa-phone"></i>
                  </button>
                </div>
                <div className="col-auto">
                  <button
                    className="call-answer-btn reject mb-2"
                    onClick={declineInstantCall}
                    title="Decline Call"
                  >
                    <FontAwesomeIcon icon={faTimes} color="white" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  };

  const checkBeforeInstantCall = useCallback(
    async (toUserId) => {
      if (state.connection) {
        return await state.connection.invoke(
          "CheckBeforeInstantCall",
          toUserId,
        );
      }
    },
    [state.connection],
  );

  const isUserOnline = useCallback(
    async (userId) => {
      return await state.connection.invoke("IsUserOnline", userId);
    },
    [state.connection],
  );

  const setClientInMeeting = useCallback(
    async (meetingId) => {
      if (state.connection) {
        await state.connection.invoke("SetClientInMeeting", meetingId);
        isClientInMeetingRef.current = true;
        dispatch({ type: "SET_CLIENT_IN_MEETING_SCREEN", payload: meetingId });
      }
    },
    [state.connection],
  );

  const setClientNotInMeeting = useCallback(async () => {
    if (state.connection) {
      await state.connection.invoke("SetClientExitMeeting");
    }
  }, [state.connection]);

  const addClientToMeetingGroup = useCallback(
    (meetingId) => {
      if (state.connection) {
        state.connection.invoke("AddClientToMeetingGroup", meetingId);
      }
    },
    [state.connection],
  );

  const sendMessageToMeetingGroup = useCallback(
    (meetingId, message) => {
      if (state.connection) {
        state.connection.invoke(
          "SendMessageToMeetingGroup",
          meetingId,
          message,
        );
      }
    },
    [state.connection],
  );

  return (
    <MeetingContext.Provider
      value={{
        ...state,
        setClientInMeeting,
        setClientNotInMeeting,
        checkBeforeInstantCall,
        isUserOnline,
        acceptInstantCall,
        declineInstantCall,
        makeInstantCall,
        addClientToMeetingGroup,
        sendMessageToMeetingGroup,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CONNECTION":
      return { ...state, connection: action.payload };
    case "SET_INSTANT_MEETING_REQUEST": // payload : { user, invitation }
      return {
        ...state,
        incomingCall: {
          user: { ...action.payload.user, ...action.payload.invitation },
          callStatus: "CALLING",
        },
        missedCallUser: null,
        unacceptableUser: null,
      };
    case "SET_UNACCEPTABLE_USER": // payload : user
      return { ...state, unacceptableUser: action.payload };
    case "HANDLE_MISSED_CALL":
      return { ...state, missedCallUser: action.payload, incomingCall: null };
    case "CLEAR_MISSED_CALL":
      return { ...state, missedCallUser: null };
    case "ACCEPT_INSTANT_CALL":
      return {
        ...state,
        incomingCall: { ...state.incomingCall, callStatus: "ACCEPTED" },
      };
    case "DECLINE_INSTANT_CALL":
      return { ...state, incomingCall: null };
    case "INSTANT_CALL_ACCEPTED_BY_OTHER_CLIENT":
      return { ...state, incomingCall: null };
    case "SET_CALLED_USER":
      return { ...state, calledUser: action.payload };
    case "SET_CALL_RESULT":
      return { ...state, callResult: action.payload };
    case "SET_CLIENT_IN_MEETING_SCREEN":
      return { ...state, isClientInMeeting: true, meetingId: action.payload };
    default:
      return state;
  }
};

let cache = {};
const getUser = async (userId) => {
  if (cache[userId]) return cache[userId];

  var userResponse = await client.get(`User/GetOnlineNetworkerById/${userId}`);
  if (userResponse.status == 200 && userResponse.data.success) {
    cache[userId] = userResponse.data.data;
    return userResponse.data.data;
  }

  return null;
};

const joinMeeting = async (meetingId) => {
  window.location.href = `/meeting-page?meetingId=${meetingId}`;
};

// export const IncomingCallModal = ({incomingCall, onAccept, onDecline}) => {
//     const user = incomingCall?.user;
//     const callAccepted = incomingCall?.callStatus === "ACCEPTED";

//       return (
//         <>
//               <h4>Let’s Talk!</h4>
//               <div className="mb-3 live-call-border"></div>
//               <div className="call-modal-user-content">
//                   <div className="row justify-content-center mb-2">
//                       <div className="call-profile-picture">
//                           <img src={user?.imageUrl || '/images/empty-image.png'} />
//                       </div>
//                   </div>
//                   <div className="row">
//                       <h4 className="call-modal-user-fullname">{user?.firstName} {user?.lastName}</h4>
//                       <h5>{user?.companyName}</h5>
//                       <p className="call-warning">
//                           {callAccepted ? "Getting Meeting Data..." : "Incoming Call"}
//                       </p>
//                   </div>
//                   <div className="row justify-content-center">
//                       {
//                           callAccepted
//                           ? <div className="col-auto"><CircularProgress /></div>
//                           : (
//                               <>
//                                   <div className="col-auto">
//                                       <button className="call-answer-btn accept mb-2" onClick={onAccept} title='Accept Call'>
//                                           <FontAwesomeIcon icon={faPhone} color='white' />
//                                           <i className="fa fa-phone"></i>
//                                       </button>
//                                   </div>
//                                   <div className="col-auto">
//                                       <button className="call-answer-btn reject mb-2" onClick={onDecline} title='Decline Call'>
//                                       <FontAwesomeIcon icon={faTimes} color='white' />
//                                       </button>
//                                   </div>
//                               </>
//                           )
//                       }
//                   </div>
//               </div>
//             </>
//       )
// }
