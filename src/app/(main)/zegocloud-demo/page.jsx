// "use client";
// import { MeetingProvider } from "@/context/MeetingContext";
// import { SignalRProvider } from "@/context/SignalRContext2";
// import { UserProvider } from "@/context/UserContext";
// import dynamic from "next/dynamic";

// const JoinMeetingLive = dynamic(
//   () => import("@/components/LiveVideo/JoinMeetingContext"),
//   { ssr: false }
// );

// export default function Page() {
//   return (
//       <UserProvider>
//         <SignalRProvider>
//           <MeetingProvider>
//             <JoinMeetingLive />
//           </MeetingProvider>
//         </SignalRProvider>
//       </UserProvider>);
// }
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page