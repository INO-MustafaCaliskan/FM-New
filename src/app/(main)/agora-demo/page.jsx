"use client";
import { SignalRProvider } from "@/context/SignalRContext2";
import { UserProvider } from "@/context/UserContext";
import dynamic from "next/dynamic";

const JoinMeetingLive = dynamic(
  () => import("@/components/LiveVideo/JoinMeetingContext"),
  { ssr: false }
);

export default function Page() {
  return (
      <UserProvider>
        <SignalRProvider>
            <JoinMeetingLive />
        </SignalRProvider>
      </UserProvider>);
}
