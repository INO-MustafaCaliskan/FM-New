"use client";

import { useMeetingStore } from "@/context/MeetingContext";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { LuPhone } from "react-icons/lu";
import { toast } from "react-toastify";
import styles from "./IncomingCallModal.module.css";
import UserAvatar from "@/components/UI/UserAvatar";

/**
 * Modal component that shows incoming call screen
 * This should be rendered in Root Layout
 * to persist across all navigation stacks
 */
export const IncomingCallModal = () => {
  const ringtoneAudio = useRef(null);
  const incomingCall = useMeetingStore((state) => state.incomingCall);
  const acceptCall = useMeetingStore((state) => state.acceptCall);
  const rejectCall = useMeetingStore((state) => state.rejectCall);
  const [accepting, setAccepting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100);

  useEffect(() => {
    if (!incomingCall?.timeOut) {
      setTimeLeft(100);
      return;
    }

    // Reset timeLeft to initial state when new call arrives
    setTimeLeft(100);

    let elapsed = 0;
    const totalDuration = incomingCall.timeOut;

    const timer = setInterval(() => {
      elapsed += 1;
      const remaining = Math.max(0, 100 - (elapsed / totalDuration) * 100);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);


    return () => clearInterval(timer);
  }, [incomingCall]);

  // ses çalma durumu için useEffect
  useEffect(() => {
    if (incomingCall && incomingCall.callStatus === "PENDING") {
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
  }, [incomingCall])

  // Only show modal when there's an incoming call and it's still pending
  if (!incomingCall || incomingCall.callStatus !== "PENDING") {
    return null;
  }

  const handleAccept = async () => {
    try {
      setAccepting(true);
      await acceptCall();
      // Modal will automatically close when state updates
    } catch (error) {
      toast.error("Failed to accept call");
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    try {
      await rejectCall();
      // Modal will automatically close when state updates
    } catch (error) {
      toast.error("Failed to reject call");
    }
  };

  return (
    <Modal
      show={true}
      backdrop="static"
      keyboard={false}
      centered
      fullscreen="lg-down"
      onHide={() => setTimeLeft(100)}
    >
      <Modal.Body className={styles.modalBody + " d-flex"}>
        <div className={styles.modalContent + " d-flex flex-column pb-4 w-100 h-100"}>
          {/* User Info Section */}
          <div className="w-100 border-bottom text-center mb-4">
            <h4 className={styles.headingTitle}>Let's Talk!</h4>
          </div>
          {/* Countdown Bar */}
          <div className={styles.countdownContainer}>
            <div className={styles.countdownBar} style={{ width: `${timeLeft}%` }} />
          </div>
          <div className={styles.userSection + " flex-grow-1 "}>
            <div className={styles.avatarContainer}>
              <UserAvatar
                imageUrl={incomingCall.user.imageUrl}
                altName={`${incomingCall.user.firstName} ${incomingCall.user.lastName}`}
                width={120}
                height={120}
                style={{border : "2px solid #EF6C00"}}
              />
            </div>

            <h2 className={styles.userName}>
              {incomingCall.user.firstName} {incomingCall.user.lastName}
            </h2>

            <div className={styles.statusBadge}>
              <span>Incoming Call...</span>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className={styles.buttonsContainer + " justify-self-end"}>
            {accepting ? (
              <div className={styles.loadingState}>
                <span>Call Initiating...</span>
              </div>
            ) : (
              <>
                <button
                  className={`${styles.circularButton} ${styles.rejectButton}`}
                  onClick={handleReject}
                  type="button"
                  aria-label="Reject call"
                >
                  <LuPhone size={28} />
                </button>

                <button
                  className={`${styles.circularButton} ${styles.acceptButton}`}
                  onClick={handleAccept}
                  type="button"
                  aria-label="Accept call"
                >
                  <LuPhone size={28} />
                </button>
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default IncomingCallModal;
