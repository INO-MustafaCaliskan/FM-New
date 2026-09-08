import { useMeetingStore } from "@/context/MeetingContext";
import { IncomingCallModal } from "./IncomingCallModal";
import { OutgoingCallModal } from "./OutgoingCallModal";

const CallModalShell = () => {
  const activeCallRequest = useMeetingStore((state) => state.activeCallRequest);
  const incomingCall = useMeetingStore((state) => state.incomingCall);

  if (activeCallRequest) return <OutgoingCallModal />;

  if (incomingCall) return <IncomingCallModal />;

  return null;
};

export default CallModalShell;
