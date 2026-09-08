import { HubConnection } from "@microsoft/signalr";
import { OnlineNetworker } from "./apiTypes";

export interface MeetingContextType {
  connection?: null | HubConnection;
  connectionStatus: "disconnected" | "connecting" | "connected" | "reconnecting";
  activeMeetingId: string | null;
  shouldNavigateToMeeting: boolean;
  isClientInMeeting: boolean;
  activeCallRequest: OutgoingCallInfo | null;
  incomingCall: IncomingCallInfo | null;
  connect: (accessToken: string, sessionId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  isUserOnline: (userId: string) => Promise<boolean>;
  acceptCall: () => Promise<void>;
  rejectCall: () => Promise<void>;
  setClientInMeeting: (fallbackMeetingId?: string | null) => void;
  leaveMeeting: () => void;
  checkBeforeInstantCall: (targetUserId: string) => Promise<CheckBeforeCallResult>;
  makeInstantCall: (targetUser: OutgoingCallTargetUser) => Promise<void>;
  cancelCallRequest: () => void;
  closeCall: () => void;
  joinOngoingMeeting: (meetingId: string) => void;
  sendMessageToMeetingGroup: (message: string) => void;
}

export type ReceiveCallEvent = {
  callId: string;
  timeOut: number;
  startedAt: string;
  caller: Caller;
};

export type Caller = {
  id: string;
  firstName: string;
  lastName: string;
  fullName : string;
  imageUrl: string | null;
  email: string;
};

export interface IncomingCallInfo {
  id: string;
  user: Caller;
  userId: string;
  callStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  startedAt: string;
  timeOut: number;
}

export type PrecheckResultStatus = "UserOffline" | "UserInContinueMeeting" | "UserCannotCalled" | "Success";

export type CheckBeforeCallResult = {
  status: PrecheckResultStatus;
  message?: string;
};

export type CallPhaseStatus = "IDLE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export type OutgoingCallResult = {
  success: boolean;
  error?: "UserOffline" | "YouAreInAnotherCall" | "InAnotherCall" | "Failed" | null;
  message?: string | null;
  callId?: string | null;
  timeOut?: number | null;
  startedAt?: string | null;
};

export type OutgoingCallTargetUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string | null;
  fTalkId: number;
};

export type OutgoingCallState =
  | "Preparing"
  | "UserOffline"
  | "YouAreInAnotherCall"
  | "InAnotherCall"
  | "Ringing"
  | "Failed"
  | "Accepted"
  | "Declined"
  | "DeclinedAsBusy"
  | "Timeout";
export interface OutgoingCallInfo {
  targetUser: OutgoingCallTargetUser;
  targetUserId: string;
  // Aşama 1: Uygunluk kontrolü
  preCheck: {
    status: CallPhaseStatus;
    result?: CheckBeforeCallResult;
    ongoingMeetingId?: string | null;
  };

  // Aşama 2: Gerçek arama
  call: {
    status: CallPhaseStatus;
    startTime?: string;
    endTime?: string;
    id?: string | null;
    state: OutgoingCallState;
    timeOut?: number | null;
  };
}

export type CallRequestResultEvent = {
  status: "Accepted" | "Declined" | "DeclinedAsBusy" | "Timeout" | "Failed";
  callId: string;
};

export interface ZegoCloudMeetingJoinResponse {
  appId: string;
  serverSecret: string;
  roomId: string;
  userId: string;
  userName: string;
  token?: string;
  appSign?: string;
}
