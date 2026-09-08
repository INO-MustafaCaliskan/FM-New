"use client";
import React, { useState, useEffect } from "react";
import InoButton from "../Buttons/InoButton";
import client from "@/utils/client";
import { useRouter } from "next/navigation";
import { useSignalR } from "@/context/SignalRContext2";
import { toast } from "react-toastify";
import RescheduleModal from "../MeetingModals/ResheduleMeeting";
import CancelMeetingModal from "../MeetingModals/CancelMeetingModal";
import Cookies from "js-cookie";
import { toZonedTime } from "date-fns-tz";
import { useMeetingStore } from "@/context/MeetingContext";

const formatToUserTimezone = (dateString) => {
  const tz = Cookies.get("timeZone") || "UTC";
  const zonedDate = toZonedTime(dateString, tz);
  return zonedDate;
};

const acceptZoomStatusHandle = async (meetingId) => {
  try {
    await client.get(`ZoomMeeting/UpdateZoomMeetingStatus/${meetingId}/2`);
    window.location.reload();
  } catch (error) {
    console.error("Error accepting zoom status:", error);
  }
};

const UpdateZoomStatus = ({ meetingId, afterSubmit }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const cancelZoomMeeting = async () => {
    try {
      setCancelLoading(true);
      let response = await client.get(`ZoomMeeting/CancelMeeting/${meetingId}`);

      if (response) {
        setCancelLoading(false);
        setShowCancelModal(false);
        afterSubmit();
        toast(response.data.message);
      }
    } catch (error) {
      setCancelLoading(false);
      console.log("Cancelled operation failed:", error);
      toast.error("Operation failed. Please try again.");
    }
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleAcceptClick = () => {
    acceptZoomStatusHandle(meetingId);
  };

  return (
    <>
      <InoButton
        title="Accept"
        green
        width={100}
        height={32}
        onClick={handleAcceptClick}
      />
      <InoButton
        title="CANCEL"
        red
        width={100}
        height={32}
        onClick={handleCancelClick}
      />
      <CancelMeetingModal
        show={showCancelModal}
        handleClose={() => setShowCancelModal(false)}
        handleConfirm={cancelZoomMeeting}
        loading={cancelLoading}
      />
    </>
  );
};

const MeetingActions = ({ meeting, afterSubmit }) => {
  const makeInstantCall = useMeetingStore((state) => state.makeInstantCall);
  const { connection, getQuickChatUser } = useSignalR();
  const [show, setShow] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState({});
  const [formattedStartDate, setFormattedStartDate] = useState(new Date());
  const [cancelLoading, setCancelLoading] = useState(false);
  useEffect(() => {
    const userTimezoneFormattedDate = formatToUserTimezone(meeting.startTime);
    setFormattedStartDate(userTimezoneFormattedDate);
  }, [meeting.startTime]);

  const isJoinNowButtonVisible = () => {
    const now = formatToUserTimezone(new Date());

    const startDate = formatToUserTimezone(meeting.startTime);
    const endDate = formatToUserTimezone(meeting.endTime);

    const joinAvailableTime = new Date(startDate);
    joinAvailableTime.setMinutes(joinAvailableTime.getMinutes() - 3);

    return now >= joinAvailableTime && now <= endDate;
  };

  const JoinMeeting = () => {
    window.location.href = `/meeting-page?meetingId=${meeting.id}`;
  };

  const handleRecall = () => {
    makeInstantCall({
      fTalkId: "",
      id: meeting.delegateId,
      firstName: meeting.delegateFirstName,
      lastName: meeting.delegateLastName,
      imageUrl: meeting.delegateImageUrl,
    });
  };

  const cancelZoomMeeting = async () => {
    handleShowCancelModal(meeting.id);
  };

  const handleRescheduleShow = (meeting) => {
    setSelectedMeeting(meeting);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleShowCancelModal = (meetingId) => {
    setSelectedMeeting({ id: meetingId });
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => setShowCancelModal(false);

  const handleConfirmCancel = async () => {
    try {
      setCancelLoading(true);
      let response = await client.get(
        `ZoomMeeting/CancelMeeting/${selectedMeeting.id}`,
      );

      if (response) {
        setCancelLoading(false);
        setShowCancelModal(false);
        afterSubmit();
        toast(response.data.message);
      }
    } catch (error) {
      setCancelLoading(false);
      console.log("Cancelled operation failed.", error);
      toast.error("Operation failed. Please try again.");
    }
  };

  const handleOnClickMessage = () => {
    messageToUser(meeting.delegateId);
  };

  const handleCancelClick = (meetingId) => {
    handleShowCancelModal(meetingId);
  };

  const messageToUser = async (userId) => {
    if (connection && connection.state === "Connected") {
      await getQuickChatUser(userId);
    }
  };

  return (
    <>
      <div className="d-flex" style={{ gap: 5 }}>
        <InoButton
          title={"Message"}
          width={100}
          height={32}
          green
          isOutline
          onClick={handleOnClickMessage}
        />

        {meeting.isHost ? (
          <>
            {meeting.zoomMeetingStatus === 1 ? (
              <>
                <InoButton
                  title={"Reschedule"}
                  width={100}
                  height={32}
                  blue
                  onClick={() => handleRescheduleShow(meeting)}
                />
                <InoButton
                  title={"CANCEL"}
                  width={100}
                  height={32}
                  red
                  onClick={() => handleCancelClick(meeting.id)}
                />
              </>
            ) : meeting.zoomMeetingStatus === 2 &&
              meeting.zoomMeetingType === 2 ? (
              <>
                <InoButton
                  title={"Reschedule"}
                  width={100}
                  height={32}
                  blue
                  onClick={() => handleRescheduleShow(meeting)}
                />
                <InoButton
                  title={"CANCEL"}
                  width={100}
                  height={32}
                  red
                  onClick={cancelZoomMeeting}
                />
                {isJoinNowButtonVisible() && (
                  <InoButton
                    title={"Join Now"}
                    width={150}
                    height={32}
                    isOutline
                    onClick={JoinMeeting}
                  />
                )}
              </>
            ) : meeting.zoomMeetingStatus === 2 &&
              meeting.zoomMeetingType === 1 ? (
              <>
                <InoButton
                  title={"Recall"}
                  width={100}
                  height={32}
                  lightBlue
                  onClick={handleRecall}
                />
              </>
            ) : meeting.zoomMeetingStatus === 3 ? (
              <>
                {isJoinNowButtonVisible() && (
                  <InoButton
                    title={"Join Now"}
                    width={150}
                    height={32}
                    isOutline
                    onClick={JoinMeeting}
                  />
                )}
              </>
            ) : meeting.zoomMeetingStatus === 4 ? (
              <>
                <InoButton
                  title={"Recall"}
                  width={100}
                  height={32}
                  lightBlue
                  onClick={handleRecall}
                />
              </>
            ) : meeting.zoomMeetingStatus === 5 ? (
              <>
                <InoButton
                  title={"Reschedule"}
                  width={100}
                  height={32}
                  blue
                  onClick={() => handleRescheduleShow(meeting)}
                />
              </>
            ) : null}
          </>
        ) : (
          <>
            {meeting.zoomMeetingStatus === 1 ? (
              <UpdateZoomStatus
                meetingId={meeting.id}
                afterSubmit={afterSubmit}
              />
            ) : meeting.zoomMeetingStatus === 2 &&
              meeting.zoomMeetingType === 2 ? (
              <>
                <InoButton
                  title={"CANCEL"}
                  width={100}
                  height={32}
                  red
                  onClick={cancelZoomMeeting}
                />
                {isJoinNowButtonVisible() && (
                  <InoButton
                    title={"Join Now"}
                    width={150}
                    height={32}
                    isOutline
                    onClick={() => JoinMeeting(meeting.id)}
                  />
                )}
              </>
            ) : meeting.zoomMeetingStatus === 2 &&
              meeting.zoomMeetingType === 1 ? (
              <>
                <InoButton
                  title={"Recall"}
                  width={100}
                  height={32}
                  lightBlue
                  onClick={() => makeInstantCall(meeting.delegateId)}
                />
              </>
            ) : meeting.zoomMeetingStatus === 3 ? (
              <>
                {isJoinNowButtonVisible() && (
                  <InoButton
                    title={"Join Now"}
                    width={150}
                    height={32}
                    isOutline
                    onClick={() => JoinMeeting(meeting.id)}
                  />
                )}
              </>
            ) : meeting.zoomMeetingStatus === 4 ? (
              <>
                <InoButton
                  title={"Recall"}
                  width={100}
                  height={32}
                  lightBlue
                  onClick={() => makeInstantCall(meeting.delegateId)}
                />
              </>
            ) : null}
          </>
        )}
      </div>
      <RescheduleModal
        show={show}
        handleClose={handleClose}
        meeting={selectedMeeting}
        afterSubmit={afterSubmit}
      />
      <CancelMeetingModal
        show={showCancelModal}
        handleClose={handleCloseCancelModal}
        handleConfirm={handleConfirmCancel}
        loading={cancelLoading}
      />
    </>
  );
};

export default MeetingActions;
