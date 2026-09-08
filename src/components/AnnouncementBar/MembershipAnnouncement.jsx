import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import "./styles.css";
import { useUser } from "@/context/UserContext";
import useDateProcess from "@/utils/hooks/useDateProcess";

function AnnouncementBar() {
  const hideMembershipAnnouncement = localStorage.getItem(
    "hideMembershipAnnouncement"
  );
  let hideUntil;
  const { dateDiffByDays } = useDateProcess();
  if (hideMembershipAnnouncement) {
    hideUntil = Date.parse(JSON.parse(hideMembershipAnnouncement));
  }
  const now = new Date().toISOString();
  const [show, setShow] = useState(
    !hideMembershipAnnouncement || Date.now() > hideUntil
  );
  const { user, loading } = useUser();

  if (loading || !user) return null;
  const dateDiff = dateDiffByDays(user.nextBillingDate, now);

  const onCloseHandler = () => {
    setShow(false);
    localStorage.setItem(
      "hideMembershipAnnouncement",
      JSON.stringify(new Date(Date.now() + 86400000))
    );
  };

  const sharedMessage =
    "Unlimited marketing, meeting, and partnering with logistics professionals are waiting for you.";

  const renderAlert = (message) => {
    // const isSuspended =
    //   typeof message === "string" && message.includes("suspended");

    return (
      <Alert
        onClose={onCloseHandler}
        dismissible
        className="text-start alert-bar m-0 p-3"
      >
        <div className="container">
          <strong>{message}</strong> <br />
          <div className="mt-2">
            <span>{sharedMessage}</span>
             <div className="mt-2">
                <a href="/pricing"  style={{color:'#5e3409'}}>
                  Click here to continue your membership.
                </a>
              </div>
          </div>
        </div>
      </Alert>
    );
  };

  return (
    <>
      {user.isFreeTrial
        ? dateDiff > 0 && dateDiff <= 3
          ? renderAlert(
              `Your free trial version will expire in ${Math.round(
                dateDiff
              )} days!`
            )
          : dateDiff < 0 && renderAlert("Your membership has been suspended!")
        : dateDiff > 0 && dateDiff <= 7
        ? renderAlert(
            `Your premium usage period will expire in ${Math.round(
              dateDiff
            )} days!`
          )
        : dateDiff < 0 && renderAlert("Your membership has been suspended!")}
    </>
  );
}

export default AnnouncementBar;
