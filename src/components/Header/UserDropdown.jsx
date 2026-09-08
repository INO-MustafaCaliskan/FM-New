import { NavDropdown, Accordion } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSignalR } from "@/context/SignalRContext2";
import { Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TimeZoneDisplay from "../UI/TimeZoneDisplay";
import { SignOut } from "@/utils/authActions";
import { useUser } from "@/context/UserContext";
import { RxChevronDown } from "react-icons/rx";

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

export const UserDropdown = () => {
  const { myInfo, changeMyStatus } = useSignalR();
  const { user, loading } = useUser();
  const router = useRouter();

  const handleUpdateStatus = async (status) => {
    await changeMyStatus(status);
    toast.success(
      `Your status changed to ${status === 1 ? "Available" : "Away"}.`,
    );
  };

  const handlePush = (e) => {
    e.preventDefault();
    router.push(e.target.href);
  };

  if (loading) {
    return <Skeleton variant="rounded" width={100} height={20} />;
  }

  let fullName = `${user?.firstName} ${user?.lastName}`;
  let statusClass = getStatusClassName(myInfo?.onlineStatus);
  let fTalkId = user?.fTalkId;
  let imageUrl = user?.imageUrl;

  return (
    <NavDropdown
      title={
        <div className="d-flex align-items-center gap-2">
          <div className="position-relative d-flex align-items-center">
            <Image
              src={imageUrl || "/images/empty-image.png"}
              className="rounded-circle"
              alt="Me"
              width={32}
              height={32}
              style={{ objectFit: "cover" }}
            />
            <i
              className={statusClass.toLowerCase()}
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                border: "2px solid white",
              }}
            ></i>
          </div>
          <div className="d-flex align-items-center" style={{ gap: "4px" }}>
            <span style={{ fontSize: "15px" }}>Me</span>
            <RxChevronDown size={18} />
          </div>
        </div>
      }
      className="header-sign-in-btn header-profile-nav"
      drop="down-centered"
    >
      <NavDropdown.Header className="profile-top d-flex flex-row align-items-center gap-2">
        <div className="col-3">
          <Image
            src={imageUrl || "/images/empty-image.png"}
            className="profile-img"
            alt={fullName}
            width={60}
            height={60}
          />
        </div>
        <div className="profile-name col-9">
          <span>{fullName}</span>
          <span
            // style="font-size:13px;padding-top:3px"
            style={{ fontSize: "13px", paddingTop: "3px" }}
            id="fTalkIdSpan"
          >
            FTALK ID: {fTalkId}
          </span>
          <span className="timezone-span" id="timezoneSpan">
            <TimeZoneDisplay timeZone={user?.timeZone} isInSpan={false} />
          </span>
        </div>
      </NavDropdown.Header>
      <Accordion>
        <Accordion.Item eventKey="0" disabled={myInfo?.onlineStatus === 3}>
          <Accordion.Header>
            <i className={`${statusClass.toLowerCase()} me-1`}></i>
            {myInfo?.onlineStatusName}
          </Accordion.Header>
          {myInfo?.onlineStatus !== 3 && (
            <Accordion.Body className="pt-2">
              <div className="d-flex flex-column">
                <p
                  className={`mb-1 user-status-btn ${myInfo?.onlineStatus === 1 ? 'active-status' : ''}`}
                  onClick={() => handleUpdateStatus(1)}
                >
                  <i id="available" className="available"></i>
                  <span> Available</span>
                </p>
                <p
                  className={`mb-1 user-status-btn ${myInfo?.onlineStatus === 2 ? 'active-status' : ''}`}
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
      <NavDropdown.Item
        className="profile-menu-item"
        href={`/user-profile/${user?.slug}`}
        onClick={handlePush}
      >
        My Profile
      </NavDropdown.Item>

      {/* <NavDropdown.Item
        className="profile-menu-item"
        href="/profile-edit"
        onClick={handlePush}
      >
        Update Profile
      </NavDropdown.Item> */}

      <NavDropdown.Item
        className="profile-menu-item"
        href="/account-settings"
        onClick={handlePush}
      >
        Account Settings
      </NavDropdown.Item>
      <NavDropdown.Item
        className="profile-menu-item"
        href="/subscription"
        onClick={handlePush}
      >
        Subscription
      </NavDropdown.Item>
      <NavDropdown.Item
        className="profile-menu-item"
        href="/pricing"
        onClick={handlePush}
      >
        Buy Package
      </NavDropdown.Item>
      <NavDropdown.Item
        className="profile-menu-item"
        href="/refer-a-friend"
        onClick={handlePush}
      >
        Refer A Friend
      </NavDropdown.Item>
      <NavDropdown.Item
        className="profile-menu-item"
        href="/get-verified"
        onClick={handlePush}
      >
        Get Verified
      </NavDropdown.Item>
      <NavDropdown.Item
        className="profile-menu-item"
        href="/contact-us"
        onClick={handlePush}
      >
        Contact Us
      </NavDropdown.Item>
      <NavDropdown.Item
        className="profile-menu-item"
        href="/sign-out"
        onClick={handlePush}
      >
        Sign Out
      </NavDropdown.Item>
    </NavDropdown>
  );
};
