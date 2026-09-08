"use client";
import React, { useRef, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import talkClient from "@/utils/client";
import InoLoading from "@/components/InoLoading/InoLoading";
import "./style.css"

export default function JoinMeetingContext() {
  const searchParams = useSearchParams();
  const meetingId = searchParams.get("meetingId") || "";
  const meetingRef = useRef(null);
  const [meetingData, setMeetingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preScreenVisible, setPreScreenVisible] = useState(true);

  useEffect(() => {
    if (!meetingId) {
      setError("Meeting ID is missing");
      setLoading(false);
      return;
    }

    async function fetchMeetingData() {
      try {
        setLoading(true);
        const response = await talkClient.get(`ZoomMeeting/JoinMeeting/${meetingId}`);
        const data = response?.data?.data;

        if (!data) {
          setError("Meeting data not found");
          setLoading(false);
          return;
        }

        setMeetingData(data);
        setLoading(false);
      } catch (e) {
        setError("Failed to fetch meeting data");
        setLoading(false);
      }
    }

    fetchMeetingData();
  }, [meetingId]);

  useEffect(() => {
    if (!meetingData) return;

    const roomID = meetingData.roomId;
    const appID = Number(meetingData.appId);
    const serverSecret = meetingData.serverSecret;
    const userID = meetingData.userId;
    const userName = meetingData.userName;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: meetingRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      onLeaveRoom: () => {
        window.location.href = "/global-networkers/";
      },
      showLeaveRoomConfirmDialog: true,
      leaveRoomDialogConfig: {
        title: "Leave Meeting",
        content: "Are you sure you want to leave the meeting?",
        cancelButtonText: "Cancel",
        confirmButtonText: "Leave",
      },
    });


    const interval = setInterval(() => {
      if (meetingRef.current) {
        const input = meetingRef.current.querySelector('input[placeholder="Your name"]');

        if (input) {
          input.disabled = true;
          setPreScreenVisible(true);
        } else {
          setPreScreenVisible(false);
        }
      }
    }, 500);

    return () => {
      clearInterval(interval);
      zp.destroy();
    };
  }, [meetingData]);


  if (loading) return <InoLoading />;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {preScreenVisible && (
        <button
          className="premeeting-back-btn"
          onClick={() => window.location.href = "/global-networkers/"}
        >
          ← Back
        </button>
      )}

      <div ref={meetingRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}






