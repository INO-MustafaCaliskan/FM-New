// "use client";

// import React, { useEffect, Suspense } from "react";
// import { useSearchParams } from 'next/navigation'
// import client from "@/utils/client";
// import InoLoading from '@/components/InoLoading/InoLoading'
// import { useSignalR } from "@/context/SignalRContext2";


// const MeetingPage = () => {
//   const {connection, setClientInMeeting } = useSignalR();

//   let userId;
//   let signature;
//   let zakToken ;
//   let meetingNumber;
//   let password;
//   let userName;
//   const searchParams = useSearchParams()
//   const meetingId = searchParams.get("meetingId");


//   const joinZoomMeetingSDKHandle = async (meetingId) => {
//     try {
//       const response = await client.get(`ZoomMeeting/JoinMeeting/${meetingId}`);
//       return response.data; 
//     } catch (error) {
//       console.error("MEETING ERROR ==> ", error);
//       return { success: false, message: 'Error joining meeting' }; // Handle the error case
//     }
//   };

//   const joinMeetingSDK = async () => {
//     const response = await joinZoomMeetingSDKHandle(meetingId);
//     console.log(response, "=> Response from SDK");
  
//     if (response.success) {
//       userId = response.data.userId;
//       signature = response.data.signature;
//       zakToken = response.data.zakToken;
//       meetingNumber = response.data.meetingNumber;
//       password = response.data.password;
//       userName = response.data.userName;
//       return true;
//     } else {
//       console.error("Failed to join meeting:", response.message);
//       return false;
//     }
//   };

  


//   useEffect(() => {

//     joinMeetingSDK().then((result) => {
//       if(!result)
//         return;

//       const startMeeting = (signature) => {
//         import("@zoom/meetingsdk").then((ZoomMtg) => {
//           ZoomMtg.ZoomMtg.preLoadWasm();
//           ZoomMtg.ZoomMtg.prepareWebSDK();
  
//           const zmmtgRoot = document.getElementById("zmmtg-root");
//           if (zmmtgRoot) {
//             zmmtgRoot.style.display = "block";
  
//             ZoomMtg.ZoomMtg.init({
//               leaveUrl: process.env.NEXT_PUBLIC_BASE_URL+"/global-networkers",
//               patchJsMedia: true,
//               leaveOnPageUnload: true,
//               success: (success) => {
//                 console.log(success);
//                 const customButton = document.createElement("button");
//                 customButton.id = "custom_button";
//                 customButton.textContent = "Custom Button";
//                 customButton.onclick = () => {
//                   alert("Custom button clicked");
//                 };
//                 document.getElementById("zmmtg-root").appendChild(customButton);
  
//                 ZoomMtg.ZoomMtg.join({
//                   signature: signature,
//                   sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY,
//                   meetingNumber: meetingNumber,
//                   passWord: password,
//                   userName: userName,
//                   userEmail: "",
//                   tk: "",
//                   zak: zakToken,
//                   success: (success) => {
//                     setClientInMeeting();
//                   },
//                   error: (error) => {
//                     console.log(error);
//                   }
//                 });
//               },
//               error: (error) => {
//                 console.log(error);
//               }
//             });
//           } else {
//             console.error("ZoomMtg root element not found");
//           }
//         });
//       };

//       if(!connection)
//         return <InoLoading />
//       else if (signature) {
//         startMeeting(signature);
//       }
//     })
    

//   }, [signature, meetingNumber, password, zakToken, connection]);

//   return (
//     <div className="App"  style={{ zIndex: 9999, position: 'relative' }}>
//       <main>
//         <div id="zmmtg-root"></div>
//       </main>
//     </div>
//   );
// };

// const MeetingPageWithSuspense = () => (
//   <Suspense fallback={<div>Loading...</div>}>
//     <MeetingPage />
//   </Suspense>
// );

// export default MeetingPageWithSuspense;
"use client";
import { useMeetingStore } from "@/context/MeetingContext";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const JoinMeetingLive = dynamic(
  () => import("@/components/LiveVideo/JoinMeetingContext"),
  { ssr: false }
);

export default function Page() {
  const connectionStatus = useMeetingStore((state) => state.connectionStatus);
  const setClientInMeeting = useMeetingStore((state) => state.setClientInMeeting);
  const activeMeetingId = useMeetingStore((state) => state.activeMeetingId);
  const leaveMeeting = useMeetingStore((state) => state.leaveMeeting);
  const params = useSearchParams();
  
    // Connection status monitoring
    useEffect(() => {
      if(connectionStatus === "connected"){
        // instant meeting ile direkt buraya yönlendirilmezse bunu parametreden yakalayıp veriyoruz.
        const meetingId = params.get("meetingId");
        if(activeMeetingId !== meetingId){
          setClientInMeeting(meetingId);
        }
        setClientInMeeting();
      }
    }, [connectionStatus, setClientInMeeting]);
  
    // Component unmount cleanup
    useEffect(() => {
      return () => {
        leaveMeeting();
      };
    }, [leaveMeeting]);

  return  <JoinMeetingLive />
}