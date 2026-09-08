import React from "react";
import { Accordion } from "react-bootstrap";
import { usePathname } from "next/navigation";
import { useSignalR } from "@/context/SignalRContext2";
import MobileUserCard from "./MobileUserCard";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const getStatusClassName = (status) => {
  switch (status) {
    case 1: // Available
      return "available";
    case 2: // Away
      return "away";
    case 3: // InAMeeting
      return "busy";
    case 4: // Offline
      return "offline";
    default: // Offline
      return "";
  }
};

export const MobileUserMenu = () => {
  const pathName = usePathname();
  const { myInfo, changeMyStatus } = useSignalR();
    const { user } = useUser();
  let statusClass = getStatusClassName(myInfo?.onlineStatus);
  const canShowGetQuote =
    user &&
    [
      "3PLs & Logistics Services",
      "Freight Forwarder",
      "Customs Broker",
      "Maritime Transport",
      "Transportation",
    ].includes(user.categoryName);
  const handleUpdateStatus = async (status) => {
    await changeMyStatus(status);
    toast.success(
      `Your status changed to ${status === 1 ? "Available" : "Away"}.`,
    );
  };

  return (
    <>
      <div
        className="d-flex justify-content-around"
        style={{ borderBottom: "1px solid #b3b3b352", width: "100%" }}
      >
        <MobileUserCard user={null} />
      </div>
      <div
        style={{
          borderBottom: "1px solid #b3b3b352",
          width: "100%",
        }}
      >
        <Accordion
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Accordion.Item
            eventKey="0"
            disabled={myInfo?.onlineStatus === 3}
            style={{
              border: "0px solid grey",
              padding: "0px",
            }}
          >
            <Accordion.Header className="mobile-dropdown user-available">
              <i className={`${statusClass.toLowerCase()} me-1`}></i>
              {myInfo?.onlineStatusName} &nbsp;
            </Accordion.Header>
            {myInfo?.onlineStatus !== 3 && (
              <Accordion.Body className="pt-2">
                <div className="d-flex flex-column">
                  <p
                    className="mb-1 user-status-btn"
                    onClick={() => handleUpdateStatus(1)}
                  >
                    <i id="available" className="available"></i>
                    <span> Available</span>
                  </p>
                  <p
                    className="mb-1 user-status-btn"
                    onClick={() => handleUpdateStatus(2)}
                  >
                    <i id="away" className="away"></i>
                    <span> Away</span>
                  </p>
                </div>
              </Accordion.Body>
            )}
          </Accordion.Item>
        </Accordion>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href={`/user-profile/${user?.slug}`}
          className={pathName?.startsWith(`/user-profile/${user?.slug}`) ? "active-nav-link" : ""}
        >
          My Profile
        </Link>
      </div>

      {/* <div className=" navbar-collapse-mobile">
        <Link
          href="/profile-edit"
          className={pathName?.startsWith("/profile-edit") ? "active-nav-link" : ""}
        >
          Update Profile
        </Link>
      </div> */}

      <div className=" navbar-collapse-mobile">
        <Link
          href="/account-settings"
          className={pathName?.startsWith("/account-settings") ? "active-nav-link" : ""}
        >
          Account Settings
        </Link>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href="/subscription"
          className={pathName?.startsWith("/subscription") ? "active-nav-link" : ""}
        >
          Subscription
        </Link>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href="/pricing"
          className={pathName?.startsWith("/pricing") ? "active-nav-link" : ""}
        >
          Buy Package
        </Link>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href="/refer-a-friend"
          className={pathName?.startsWith("/refer-a-friend") ? "active-nav-link" : ""}
        >
          Refer a Friend
        </Link>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href="/contact-us"
          className={pathName?.startsWith("/contact-us") ? "active-nav-link" : ""}
        >
          Contact Us
        </Link>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href="/global-networkers"
          className={pathName?.startsWith("/global-networkers") ? "active-nav-link" : ""}
        >
          Global Networkers
        </Link>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href="/my-network"
          className={pathName?.startsWith("/my-network") ? "active-nav-link" : ""}
        >
          My Networks
        </Link>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href="/my-meetings"
          className={pathName?.startsWith("/my-meetings") ? "active-nav-link" : ""}
        >
          My Meetings
        </Link>
      </div>
      {canShowGetQuote && (
        <div className=" navbar-collapse-mobile">
          <Link
            href="/get-quote"
            className={pathName?.startsWith("/get-quote") ? "active-nav-link" : ""}
          >
            Get Quote
          </Link>
        </div>
      )}
      <div className=" navbar-collapse-mobile">
        <Link
          href="/get-verified"
          className={pathName?.startsWith("/get-verified") ? "active-nav-link" : ""}
        >
          Get Verified
        </Link>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href="/feed"
          className={pathName?.startsWith("/feed") ? "active-nav-link" : ""}
        >
          News Feed
        </Link>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href="/chat"
          className={pathName?.startsWith("/chat") ? "active-nav-link" : ""}
        >
          Chat
        </Link>
      </div>
      <div className=" profile-menu-item-sign-out justify-content-center">
        <Link href="/sign-out" style={{ text: "center" }}>
          Sign Out
        </Link>
      </div>
    </>
  );
};

export default MobileUserMenu;
