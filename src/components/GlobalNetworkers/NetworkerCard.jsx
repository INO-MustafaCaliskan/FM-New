import Image from "next/image";
import { useRouter } from "next/navigation";
import NetworkersCreateSheduleModal from "./NetworkersCreateSheduleModal";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import client from "@/utils/client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Cookies from "js-cookie";
import { useUser } from "@/context/UserContext";
import AuthRequiredModal from "@/components/AuthModal/AuthModal";
import Modal from "react-bootstrap/Modal";
import {
  LuVideo,
  LuCalendarPlus,
  LuShieldCheck,
  LuUserPlus,
  LuUserCheck,
} from "react-icons/lu";
import { PiClockUserLight } from "react-icons/pi";

const setStatusClassName = (status) => {
  switch (status) {
    case 1: return "available";
    case 2: return "away";
    case 3: return "busy";
    default: return "offline";
  }
};

const NetworkerCard = ({ user, onClickMessage, makeInstantCall }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(user.isFavorite);
  
  const getInitialStatus = (userData) => {
    if (userData?.networkConnection?.statusName) {
      return userData.networkConnection.statusName;
    }
    if (userData?.isConnected) {
      return "Accepted";
    }
    return userData?.connectionStatus || null;
  };

  const getInitialIsMyRequest = (userData) => {
    if (userData?.networkConnection?.isMyRequest !== undefined) {
      return userData.networkConnection.isMyRequest;
    }
    return true;
  };

  const [connectionStatus, setConnectionStatus] = useState(getInitialStatus(user));
  const [isMyRequest, setIsMyRequest] = useState(getInitialIsMyRequest(user));

  useEffect(() => {
    setConnectionStatus(getInitialStatus(user));
    setIsMyRequest(getInitialIsMyRequest(user));
  }, [
    user?.networkConnection?.statusName,
    user?.networkConnection?.isMyRequest,
    user?.isConnected,
    user?.connectionStatus,
  ]);

  const [scheduleModalShow, setScheduleModalShow] = useState(false);
  const [authModalShow, setAuthModalShow] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingConnection, setIsAddingConnection] = useState(false);
  const [isRemovingConnection, setIsRemovingConnection] = useState(false);
  const { user: currentUser } = useUser();

  const isUserAuthenticated = () => {
    const token = Cookies.get("accessToken");
    return !!token;
  };

  const handleChatClick = () => {
    if (!isUserAuthenticated()) { setAuthModalShow(true); return; }
    onClickMessage(user.id);
  };

  const handleCallClick = () => {
    if (!isUserAuthenticated()) { setAuthModalShow(true); return; }
    makeInstantCall(user.id);
  };

  const handleScheduleClick = () => {
    if (!isUserAuthenticated()) { setAuthModalShow(true); return; }
    setScheduleModalShow(true);
  };

  const toggleUserFavorite = async () => {
    const firstState = isFavorite;
    setIsFavorite((prev) => !prev);
    const response = await client.get("/UserFavorite/AddOrRemoveForLoginUser/" + user.id);
    if (!response.data.success) {
      setIsFavorite((prev) => !prev);
    } else {
      if (!firstState) toast.info("User added to your favorites");
    }
  };

  const handleSendConnectionRequest = async () => {
    setIsAddingConnection(true);
    try {
      const response = await client.post(`/NetworkConnection/Request/${user.id}`);
      if (response.data?.success) {
        setConnectionStatus("Pending");
        setIsMyRequest(true);
        toast.success("Connection request sent!");
      } else {
        toast.error(response.data?.message || "Failed to send connection request.");
      }
    } catch (err) {
      toast.error("Failed to send connection request.");
    } finally {
      setIsAddingConnection(false);
      setShowAddModal(false);
    }
  };

  const isAccepted =
    connectionStatus?.toLowerCase() === "accepted" ||
    connectionStatus?.toLowerCase() === "connected";
  const isPending = connectionStatus?.toLowerCase() === "pending";

  const handleConnectionClick = () => {
    if (isAccepted) {
      setShowRemoveModal(true);
    } else if (isPending) {
      if (isMyRequest) {
        router.push("/my-network/send-request");
      } else {
        router.push("/my-network/pending-request");
      }
    } else {
      setShowAddModal(true);
    }
  };

  const handleRemoveConnection = async () => {
    setIsRemovingConnection(true);
    try {
      const response = await client.get(`/NetworkConnection/Remove/${user.id}`);
      if (response.data?.success) {
        setConnectionStatus(null);
        toast.success("Connection removed successfully.");
      } else {
        toast.error(response.data?.message || "Failed to remove connection.");
      }
    } catch (err) {
      toast.error("Failed to remove connection.");
    } finally {
      setIsRemovingConnection(false);
      setShowRemoveModal(false);
    }
  };

  const userFullName = `${user.firstName} ${user.lastName}`;
  const MAX_JOB_TITLE_LENGTH = 20;
  const jobTitleName = user.jobTitleName || "Job/Title not specified";
  const showFullJobTitle = isUserAuthenticated();
  const isJobTitleTruncated = !showFullJobTitle && jobTitleName.length > MAX_JOB_TITLE_LENGTH;
  const displayJobTitle = isJobTitleTruncated
    ? `${jobTitleName.slice(0, MAX_JOB_TITLE_LENGTH).trimEnd()}...`
    : jobTitleName;

  const renderConnectionIcon = () => {
    if (isAccepted) {
      return <LuUserCheck size={18} color="#28a745" style={{ stroke: "#28a745" }} />;
    }
    if (isPending) {
      return <PiClockUserLight size={20} color="#e6a817" />;
    }
    return <LuUserPlus size={18} color="#6c757d" />;
  };

  const connectionTooltipText = isAccepted
    ? "Remove Connection"
    : isPending
    ? isMyRequest
      ? "Request Pending"
      : "Respond to Request"
    : "Add Connection";

  return (
    <>
      <div
        className="col-lg-4 col-sm-12 mb-3 card-profile align-self-stretch"
        data-user-id={user.id}
      >
        <div className="card ft-profile-card align-items-stretch networkers-card-info h-100">
          <div className="card-header border-0">
            <div className="row">
              <div className="col-8 text-start">
                <b>Category</b><br />
                {user.categoryName || "Category not specified"}
              </div>
              <div className="col-4 text-end">
                <b>FTalk ID</b><br />
                {user.fTalkId}
              </div>
            </div>
          </div>
          <div className="card-body networker-card d-flex flex-column justify-content-between">
            <div className="d-flex">
              <div className="n-card-avatar d-flex flex-column align-items-center">
                <div className="profile-picture">
                  {isUserAuthenticated() && (
                    <i className={setStatusClassName(user.onlineStatus)}></i>
                  )}
                  <Image
                    src={user.imageUrl ? user.imageUrl : "/images/empty-image.png"}
                    alt={userFullName}
                    className="profile-image rounded-circle cursor-pointer ft-profile-link"
                    width={100}
                    height={100}
                    onClick={() => { window.location.href = `/user-profile/${user.slug}`; }}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="flex-fill ms-1">
                <div className="profile-info text-start">
                  <h5
                    className="profile-fullname fw-bold d-inline cursor-pointer ft-profile-link-text"
                    onClick={() => { window.location.href = `/user-profile/${user.slug}`; }}
                  >
                    {userFullName}
                  </h5>
                  <span></span>
                  {isJobTitleTruncated ? (
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id={`job-title-tooltip-${user.id}`} className="job-title-tooltip">
                          {jobTitleName}
                        </Tooltip>
                      }
                    >
                      <p className="profile-title">{displayJobTitle}</p>
                    </OverlayTrigger>
                  ) : (
                    <p className="profile-title profile-title-full">{displayJobTitle}</p>
                  )}
                  <p className="profile-company fw-bold">{user.companyName}</p>
                  <p className="profile-country">
                    <i className="fi fi-tr"></i>
                    <span>
                      {user.cityName ? `${user.cityName}, ` : ""}
                      {user.countryName}
                    </span>
                  </p>
                </div>
              </div>
              <div className="favorite-btn d-flex align-items-start justify-content-end gap-2">
                {isUserAuthenticated() ? (
                  <>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-conn-${user.id}`} className="custom-orange-tooltip">
                          {connectionTooltipText}
                        </Tooltip>
                      }
                    >
                      <button
                        type="button"
                        className={`btn border-0 bg-transparent p-1 shadow-none d-flex align-items-center justify-content-center ${
                          isAccepted ? "btn-network-remove" : "btn-network-add"
                        }`}
                        onClick={handleConnectionClick}
                      >
                        {renderConnectionIcon()}
                      </button>
                    </OverlayTrigger>

                    {isFavorite ? (
                      <button
                        type="button"
                        className="btn border-0 bg-transparent p-1 shadow-none d-flex align-items-center justify-content-center"
                        onClick={toggleUserFavorite}
                      >
                        <FontAwesomeIcon icon={faStarSolid} fontSize={16} color="#ffa500" />
                      </button>
                    ) : (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-fav-${user.id}`} className="custom-orange-tooltip">
                            Add Favorite and Follow
                          </Tooltip>
                        }
                      >
                        <button
                          type="button"
                          className="btn border-0 bg-transparent p-1 shadow-none d-flex align-items-center justify-content-center"
                          onClick={toggleUserFavorite}
                        >
                          <FontAwesomeIcon icon={faStar} fontSize={16} color="#6c757d" />
                        </button>
                      </OverlayTrigger>
                    )}
                  </>
                ) : (
                  <button
                    className="btn ino-button"
                    onClick={() => { window.location.href = `/user-profile/${user.slug}`; }}
                  >
                    VIEW PROFILE
                  </button>
                )}
              </div>
            </div>
            <div className="row pt-3 profile-action">
              <div className="col pr-0">
                <button
                  onClick={handleCallClick}
                  className="btn ft-btn-call w-100 call-modal d-flex justify-content-center gap-2"
                >
                  <LuVideo className="networker-card-button-icon" />
                  <span>Call</span>
                </button>
              </div>
              <div className="col pr-0">
                <button
                  onClick={handleChatClick}
                  className="btn ft-btn-message quick-message-chatbox-btn w-100 d-flex justify-content-center gap-2"
                >
                  <div className="spinner-border quick-chat-spinner" role="status"></div>
                  <LuShieldCheck className="networker-card-button-icon" /> <span>CHAT</span>
                </button>
              </div>
              <div className="col pr-0 networker-schedule-col">
                <div className="networker-schedule-icons d-flex justify-content-end">
                  {user.referralBadge && (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="referral-tooltip" className="referral-tooltip">
                          Awarded to members who help grow the Freight Talk community through successful referrals.
                        </Tooltip>
                      }
                    >
                      <span className="badge rounded-pill status-pill status-pill-warning networker-schedule-icon-item">
                        <Image
                          src="/images/refer-a-friend-community.png"
                          alt="Referral Icon"
                          className="networker-referral-icon"
                          width={60}
                          height={35}
                        />
                      </span>
                    </OverlayTrigger>
                  )}
                </div>
                <button
                  onClick={handleScheduleClick}
                  className="btn ft-btn-message quick-message-chatbox-btn w-100 d-flex justify-content-center gap-2"
                >
                  <div className="spinner-border quick-chat-spinner" role="status"></div>
                  <LuCalendarPlus className="networker-card-button-icon" /> <span>SCHEDULE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NetworkersCreateSheduleModal
        show={scheduleModalShow}
        handleClose={() => setScheduleModalShow(false)}
        userId={user.id}
      />
      <AuthRequiredModal show={authModalShow} onClose={() => setAuthModalShow(false)} />

      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)} centered>
        <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
          <Modal.Title className="fs-5 fw-bold mb-0">Remove Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove <strong>{userFullName}</strong> from your network?
        </Modal.Body>
        <Modal.Footer className="border-0">
          <button
            className="btn ino-button-gray-outline px-4 d-flex justify-content-center align-items-center"
            style={{ minWidth: "120px", height: "36px" }}
            onClick={() => setShowRemoveModal(false)}
            disabled={isRemovingConnection}
          >
            Cancel
          </button>
          <button
            className="btn ino-button-red px-4 d-flex justify-content-center align-items-center gap-1"
            style={{ minWidth: "120px", height: "36px" }}
            onClick={handleRemoveConnection}
            disabled={isRemovingConnection}
          >
            {isRemovingConnection ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : null}
            Remove
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
          <Modal.Title className="fs-5 fw-bold mb-0">Add Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to send a connection request to <strong>{userFullName}</strong>?
        </Modal.Body>
        <Modal.Footer className="border-0">
          <button
            className="btn ino-button-gray-outline px-4 d-flex justify-content-center align-items-center"
            style={{ minWidth: "120px", height: "36px" }}
            onClick={() => setShowAddModal(false)}
            disabled={isAddingConnection}
          >
            Cancel
          </button>
          <button
            className="btn ino-button px-4 d-flex justify-content-center align-items-center gap-1"
            style={{ minWidth: "120px", height: "36px" }}
            onClick={handleSendConnectionRequest}
            disabled={isAddingConnection}
          >
            {isAddingConnection ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : null}
            Send Request
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NetworkerCard;
