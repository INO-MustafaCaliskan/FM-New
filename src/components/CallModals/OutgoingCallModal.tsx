"use client";

import { useMeetingStore } from "@/context/MeetingContext";
import { OutgoingCallState, PrecheckResultStatus } from "@/types/meetingTypes";
import React, { useEffect, useRef } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./OutgoingCallModal.module.css";
import UserAvatar from "../UI/UserAvatar";

const preCheckResultMessage: Record<PrecheckResultStatus, string> = {
  UserOffline: "User is offline",
  UserInContinueMeeting:
    "You already have an ongoing meeting with this user. Do you want to join that meeting instead?",
  UserCannotCalled: "User cannot be called at the moment",
  Success: "User is available",
};

const callResultMessages: Record<OutgoingCallState, string> = {
  Preparing: "Preparing call...",
  Ringing: "Ringing...",
  Accepted: "Call Accepted. Please wait while we connect you...",
  Declined: "User cannot take the call right now.",
  DeclinedAsBusy: "User is currently in another call and cannot take your call.",
  Timeout: "User can not be reached.",
  Failed: "Call Failed. Please try again later.",
  UserOffline: "User is offline.",
  YouAreInAnotherCall: "You are in another call. Please end current call to start a new one.",
  InAnotherCall: "User is in another call right now. Please try again later.",
};

/**
 * Modal component that shows outgoing call screen
 * Displays call phases according to OutgoingCallInfo structure:
 * 1. PreCheck phase (checking availability)
 * 2. Call phase (calling/connected)
 */
export const OutgoingCallModal = () => {
  const ringtoneAudio = useRef(null);
  const activeCallRequest = useMeetingStore((state) => state.activeCallRequest);
  const cancelCallRequest = useMeetingStore((state) => state.cancelCallRequest);
  const closeCall = useMeetingStore((state) => state.closeCall);
  const joinOngoingMeeting = useMeetingStore((state) => state.joinOngoingMeeting);

  // ses çalma durumu için useEffect
  useEffect(() => {
    if (activeCallRequest && (activeCallRequest.call.state === "Preparing" || activeCallRequest?.call.state === "Ringing")) {
      if (!ringtoneAudio.current) {
        ringtoneAudio.current = new Audio("/incoming-call-sound/ringtone.mp3");
        ringtoneAudio.current.loop = true;
        ringtoneAudio.current
          .play()
          .catch((err) => console.error("Error playing ringtone:", err));
      }
    }else{
      if (ringtoneAudio.current) {
        ringtoneAudio.current.pause();
        ringtoneAudio.current.currentTime = 0;
        ringtoneAudio.current = null;
      }
    }

    // Cleanup function - component unmount veya dependency değiştiğinde çalışır
    return () => {
      if (ringtoneAudio.current) {
        ringtoneAudio.current.pause();
        ringtoneAudio.current.currentTime = 0;
        ringtoneAudio.current = null;
      }
    };
  }, [activeCallRequest])

  if (!activeCallRequest) {
    return null;
  }

  const targetUser = activeCallRequest.targetUser;
  const hasOngoingMeetingId = activeCallRequest?.preCheck.ongoingMeetingId ? true : false;

  const handleCancel = () => {
    try {
      cancelCallRequest();
    } catch (error) {
      toast.error("Failed to cancel call");
    }
  };

  const handleJoinOngoingMeeting = () => {
    try {
      const ongoingMeetingId = activeCallRequest.preCheck.ongoingMeetingId;
      if (ongoingMeetingId) {
        joinOngoingMeeting(ongoingMeetingId);
      }
    } catch (error) {
      toast.error("Failed to join meeting");
    }
  };

  const handleCloseCall = () => {
    try {
      closeCall();
    } catch (error) {
      toast.error("Failed to close call");
    }
  };

  // Determine status message based on call phases
  const getStatusMessage = () => {
    const { preCheck, call } = activeCallRequest;

    // Phase 1: PreCheck
    if (preCheck.status === "IN_PROGRESS") {
      return "Checking availability...";
    }

    if (preCheck.status === "FAILED") {
      return preCheckResultMessage[preCheck.result?.status || "UserCannotCalled"];
    }

    // Phase 2: Call (only if preCheck completed successfully)
    if (preCheck.status === "COMPLETED") {
      if (call.status === "IN_PROGRESS") {
        return "Ringing...";
      }

      if (call.status === "COMPLETED" || call.status === "FAILED") {
        return callResultMessages[call.state || "Failed"] || "Call ended";
      }

      // Default while in call phase
      return "Calling...";
    }

    return "Initiating call...";
  };

  // Determine if we should show loading indicator
  const isLoading =
    activeCallRequest.preCheck.status === "IN_PROGRESS" ||
    (activeCallRequest.preCheck.status === "COMPLETED" && activeCallRequest.call.status === "IN_PROGRESS");

  // Determine if call failed or ended
  const isCallEnded =
    (activeCallRequest.preCheck.status === "COMPLETED" || activeCallRequest.preCheck.status === "FAILED") &&
    (activeCallRequest.call.status === "COMPLETED" || activeCallRequest.call.status === "FAILED");
  const isCallPreparing = activeCallRequest.call.status === "COMPLETED" && activeCallRequest.call.state === "Accepted";
  const isCallCancellable = !isCallEnded && !isCallPreparing;

  return (
    <Modal
      show={true}
      backdrop="static"
      keyboard={false}
      fullscreen="lg-down"
      centered
    >
      <Modal.Body className={styles.modalBody + " d-flex justify-content-center align-items-center"}>
        <div className={styles.modalContent + " d-flex flex-column py-4"}>
          {/* User Info Section */}
          <div className="d-flex flex-column align-items-center mb-4">
            <div className={styles.avatarContainer}>
                <UserAvatar
                  imageUrl={targetUser.imageUrl}
                  altName={`${targetUser.firstName} ${targetUser.lastName}`}
                  width={120}
                  height={120}
                  style={{border : "2px solid #EF6C00"}}
                />
            </div>

            <h2 className={styles.userName}>
              {targetUser.firstName} {targetUser.lastName}
            </h2>

            {/* Status with loading indicator */}
            <div
              className={`${styles.statusBadge} ${isLoading ? styles.statusActive : ""} d-flex flex-row justify-content-center align-items-center`}
            >
              <span>{getStatusMessage()}</span>
            </div>

            {isCallPreparing && <div className={styles.preparingText}>Preparing your meeting...</div>}
          </div>

          {/* Action Buttons Section */}
          <div className={styles.buttonsContainer}>
            {isCallCancellable && (
              <button className={`${styles.button} ${styles.rejectButton}`} onClick={handleCancel} type="button">
                Cancel
              </button>
            )}

            {isCallEnded && !hasOngoingMeetingId && (
              <button className={`${styles.button}`} onClick={handleCloseCall} type="button">
                Close
              </button>
            )}

            {hasOngoingMeetingId && (
              <>
                <button
                  className={`${styles.button} ${styles.confirmButton}`}
                  onClick={handleJoinOngoingMeeting}
                  type="button"
                >
                  Join Meeting
                </button>
                <button
                  className={`${styles.button}`}
                  onClick={handleCancel}
                  type="button"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OutgoingCallModal;
