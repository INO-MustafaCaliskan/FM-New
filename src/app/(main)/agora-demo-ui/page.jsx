"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// AgoraUIKit'yi dinamik olarak import et
const AgoraUIKit = dynamic(() => import("agora-react-uikit"), { ssr: false });

const Page = () => {
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteUsers, setRemoteUsers] = useState([]);

  const rtcProps = {
    appId: "475c4cee9e8a4973a9632e221fba3e4c",
    channel: "b181c680-1002-4776-aebb-f83b5c295fb5",
    token:
      "006475c4cee9e8a4973a9632e221fba3e4cIABSuARJycs7D16jUoAI76Yzhx3BDTIcYbiVj%2BSBwH0Raimn1BkAAAAAIgDQ7VVbncVOZwQAAQAtgk1nAgAtgk1nAwAtgk1nBAAtgk1n",
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const joinChannel = async () => {
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;

        const client = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });

        await client.join(rtcProps.appId, rtcProps.channel, rtcProps.token, null);
        const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

        setLocalTracks([microphoneTrack, cameraTrack]);
        microphoneTrack.play();

        await client.publish([microphoneTrack, cameraTrack]);

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            setRemoteUsers((prevUsers) => [...prevUsers, user]);
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });

        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "video") {
            setRemoteUsers((prevUsers) =>
              prevUsers.filter((remoteUser) => remoteUser !== user)
            );
          }
        });
      };

      joinChannel();
    }
  }, []);

  return (
    <div style={{ minHeight: "1800px" }}>
      <AgoraUIKit
        rtcProps={rtcProps}
        localTracks={localTracks}
        remoteUsers={remoteUsers}
      />
    </div>
  );
};

export default Page;
