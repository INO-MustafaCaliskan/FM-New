import { useMeetingStore } from "@/context/MeetingContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook that manages navigation when incoming call is accepted
 * Listens to incomingCall state and navigates to active call screen
 */
export const useCallNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const shouldNavigateToMeeting = useMeetingStore((state) => state.shouldNavigateToMeeting);
  const activeMeetingId = useMeetingStore((state) => state.activeMeetingId);

  useEffect(() => {
    if (!shouldNavigateToMeeting) return;

    if (!activeMeetingId) {
      useMeetingStore.setState({ shouldNavigateToMeeting: false });
      console.warn("Navigation request ignored because activeMeetingId is missing.");
      return;
    }

    // Only navigate if not already on the meeting screen to avoid duplicate navigation
    if (pathname === "/meeting-page") {
      useMeetingStore.setState({ shouldNavigateToMeeting: false });
      return;
    }

    useMeetingStore.setState({ shouldNavigateToMeeting: false });
    router.push("/meeting-page/?meetingId=" + activeMeetingId);
  }, [shouldNavigateToMeeting, activeMeetingId, pathname, router]);
};
