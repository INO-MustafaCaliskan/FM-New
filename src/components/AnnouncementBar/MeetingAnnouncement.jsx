"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faUser,
  faBuilding,
  faGlobe,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import InoButton from "@/components/Buttons/InoButton";
import client from "@/utils/client";
import useDateProcess from "@/utils/hooks/useDateProcess";
import { useUser } from "@/context/UserContext";
import { DateTime } from "luxon";
import "./styles.css";


const formatCountdown = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const pad = (n) => String(n).padStart(2, "0");
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};


function MeetingAnnouncement() {
  const router = useRouter();
  const { user } = useUser();
  const { dateDiffByMinutes, timeOnly } = useDateProcess();

  const timezoneLabel = (() => {
    try {
      const tz = user?.timeZone;
      if (!tz) return "";
      const offset = DateTime.now().setZone(tz).offset; // minutes
      const sign = offset >= 0 ? "+" : "-";
      const abs = Math.abs(offset);
      const h = Math.floor(abs / 60);
      const m = abs % 60;
      return m === 0 ? `UTC${sign}${h}` : `UTC${sign}${h}:${String(m).padStart(2, "0")}`;
    } catch {
      return "";
    }
  })();
  const [collapsed, setCollapsed] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [visible, setVisible] = useState(false);

  const fetchMeeting = useCallback(async () => {
    try {
      const response = await client.get("/ZoomMeeting/IncomingMeetingForUser");
      const data = response.data?.data;

      if (!data) {
        setMeeting(null);
        setVisible(false);
        return;
      }

      // dateDiffByMinutes(startTime, now) → pozitif = henüz başlamadı
      const nowISO = new Date().toISOString();
      const diffMinutes = dateDiffByMinutes(data.startTime, nowISO);

      // Show only if meeting hasn't started yet and starts within 15 minutes
      if (diffMinutes > 0 && diffMinutes <= 15) {
        setMeeting(data);
        setRemaining(diffMinutes * 60 * 1000);
        setVisible(true);
      } else {
        setMeeting(null);
        setVisible(false);
      }
    } catch {
      setMeeting(null);
      setVisible(false);
    }
  }, [dateDiffByMinutes]);

  // Fetch on mount
  useEffect(() => {
    fetchMeeting();
  }, [fetchMeeting]);

  // Countdown ticker
  useEffect(() => {
    if (!meeting) return;

    const interval = setInterval(() => {
      const nowISO = new Date().toISOString();
      const diffMinutes = dateDiffByMinutes(meeting.startTime, nowISO);

      if (diffMinutes <= 0) {
        // Meeting has started — hide the bar
        setVisible(false);
        setMeeting(null);
        clearInterval(interval);
        return;
      }

      setRemaining(diffMinutes * 60 * 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [meeting, dateDiffByMinutes]);

  const THREE_MINUTES_MS = 3 * 60 * 1000;

  const JoinMeeting = () => {
    window.location.href = `/meeting-page?meetingId=${meeting.id}`;
  };

  const handleButtonClick = () => {
    if (remaining <= THREE_MINUTES_MS) {
      JoinMeeting();
    } else {
      router.push("/my-meetings?tab=confirmed");
    }
  };

  if (!visible || !meeting) return null;

  return (
    <Alert
      className={`alert-bar meeting-bar m-0 ${
        collapsed ? "meeting-bar-collapsed" : ""
      }`}
    >
      <div className="container d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="meeting-bar-info">
          <div className="meeting-bar-title">
            You have an upcoming meeting on Freight Talk
          </div>
          <div
            className={`meeting-bar-details ${
              collapsed ? "meeting-bar-details-collapsed" : ""
            }`}
          >
            <span className="meeting-bar-detail-item">
              <FontAwesomeIcon icon={faClock} className="meeting-bar-detail-icon" />
              Meeting time:{" "}
              <strong>
                {timeOnly(meeting.startTime)}{timezoneLabel ? ` (${timezoneLabel})` : ""}
              </strong>
            </span>
            <span className="meeting-bar-detail-item">
              <FontAwesomeIcon icon={faUser} className="meeting-bar-detail-icon" />
              Participant: <strong>{meeting.userName}</strong>
            </span>
            <span className="meeting-bar-detail-item">
              <FontAwesomeIcon icon={faBuilding} className="meeting-bar-detail-icon" />
              Company: <strong>{meeting.userCompanyName || "Unknown"}</strong>
            </span>
            <span className="meeting-bar-detail-item">
              <FontAwesomeIcon icon={faGlobe} className="meeting-bar-detail-icon" />
              Country: <strong>{meeting.countryName || "Unknown"}</strong>
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="meeting-countdown">{formatCountdown(remaining)}</span>
          <InoButton
            title={remaining <= THREE_MINUTES_MS ? "Join Now" : "View Meeting"}
            isOutline
            width={150}
            height={32}
            onClick={handleButtonClick}
          />
        </div>
      </div>
      <button
        type="button"
        className={`meeting-bar-toggle ${
          collapsed ? "meeting-bar-toggle-collapsed" : ""
        }`}
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand" : "Collapse"}
      >
        <FontAwesomeIcon icon={faChevronUp} />
      </button>
    </Alert>
  );
}

export default MeetingAnnouncement;
