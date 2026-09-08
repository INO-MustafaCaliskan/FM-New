"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Container, Card, Spinner, Modal } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { LuCheck, LuX, LuBuilding2, LuArrowLeft } from "react-icons/lu";
import { BsPeopleFill } from "react-icons/bs";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import ProfileSidebar from "@/components/ProfileSidebar/ProfileSidebar";
import NetworkNavTabs from "@/components/MyNetworks/NetworkNavTabs";
import { useUser } from "@/context/UserContext";
import { usePendingRequestContext } from "@/context/PendingRequestContext";
import client from "@/utils/client";
import "./pending-request.css";

const PendingRequestsPage = () => {
  const { user } = useUser();
  const { decreaseCount } = usePendingRequestContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await client.get("/NetworkConnection/PendingRequests");
      if (response.data?.success) {
        setRequests(response.data.data ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch pending requests:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const handleAccept = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      const response = await client.post(`/NetworkConnection/Accept/${confirmAction.request.id}`);
      if (response.data?.success) {
        toast.success("Connection request accepted!");
        setRequests((prev) => prev.filter((r) => r.id !== confirmAction.request.id));
        decreaseCount();
      } else {
        toast.error(response.data?.message || "Failed to accept request.");
      }
    } catch (err) {
      toast.error("Failed to accept request.");
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  const handleDecline = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      const response = await client.post(`/NetworkConnection/Decline/${confirmAction.request.id}`);
      if (response.data?.success) {
        toast.info("Connection request declined.");
        setRequests((prev) => prev.filter((r) => r.id !== confirmAction.request.id));
        decreaseCount();
      } else {
        toast.error(response.data?.message || "Failed to decline request.");
      }
    } catch (err) {
      toast.error("Failed to decline request.");
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  // API response: req.requester (or fallback req.sender) -> { fullName, imageUrl, companyName, jobTitle, slug, categoryName }
  const getSender = (req) => req?.requester ?? req?.sender ?? {};
  const senderName = (req) =>
    getSender(req)?.fullName ||
    `${getSender(req)?.firstName ?? ""} ${getSender(req)?.lastName ?? ""}`.trim() ||
    "Unknown";

  return (
    <div className="pending-requests-page">
      <Container className="py-2 py-md-3">
        <InoBreadcrumb linkName="Pending Requests" />
        <div className="row g-3 g-xl-4 justify-content-between">
          <div className="col-xl-3 col-12">
            <div className="d-flex flex-column gap-3" style={{ position: "sticky", top: "16px" }}>
              <ProfileSidebar
                userInfo={user}
                ownProfileActionLabel="Preview My Profile"
                ownProfileActionHref={`/user-profile/${user?.slug}`}
                style={{ position: "relative", top: "auto" }}
              />
            </div>
          </div>

          <div className="col-xl-9 col-12">
            <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <Link
                  href="/my-network"
                  className="back-to-network-link"
                >
                  <LuArrowLeft size={16} className="back-arrow-icon" />
                  <span>My Network</span>
                </Link>
                <h4 className="fw-bold text-dark mb-1 fs-5">Pending Requests</h4>
                <p className="text-secondary mb-0 small">
                  People who sent you a connection request. Accept or decline below.
                </p>
              </div>
              <NetworkNavTabs />
            </div>

            <Card className="request-card w-100">
              <Card.Body className="p-0">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <Spinner animation="border" style={{ color: "#f97a29" }} />
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-5 px-4">
                    <BsPeopleFill size={48} className="mb-3" style={{ color: "#d1d5db" }} />
                    <h6 className="fw-semibold text-dark mb-1">No pending requests</h6>
                    <p className="text-muted small mb-0">
                      You have no incoming connection requests at the moment.
                    </p>
                  </div>
                ) : (
                  <div>
                    {requests.map((req) => {
                      const sender = getSender(req);
                      const profileUrl = sender.slug ? `/user-profile/${sender.slug}` : "#";
                      return (
                        <div key={req.id} className="request-item">
                          <div className="request-user-info">
                            <div className="request-avatar-wrap">
                              <Link href={profileUrl}>
                                <Image
                                  src={sender.imageUrl || "/images/empty-image.png"}
                                  alt={senderName(req)}
                                  width={50}
                                  height={50}
                                  className="request-avatar-img"
                                />
                              </Link>
                            </div>
                            <div className="request-user-details">
                              <Link
                                href={profileUrl}
                                className="profile-name-link text-truncate"
                              >
                                {senderName(req)}
                              </Link>
                              {sender.companyName && (
                                <div className="request-meta-text">
                                  <LuBuilding2 size={13} className="text-muted flex-shrink-0" />
                                  <span className="text-truncate">{sender.companyName}</span>
                                </div>
                              )}
                              {sender.jobTitle && (
                                <div className="request-meta-text">
                                  <span className="text-truncate">{sender.jobTitle}</span>
                                </div>
                              )}
                              {sender.categoryName && (
                                <div className="request-meta-text mt-1">
                                  <span
                                    className="badge bg-light text-secondary border px-2 py-1"
                                    style={{ fontSize: "0.72rem", fontWeight: 500 }}
                                  >
                                    {sender.categoryName}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="request-actions">
                            <button
                              type="button"
                              className="btn btn-req-accept"
                              onClick={() => setConfirmAction({ type: "accept", request: req })}
                            >
                              <LuCheck size={16} /> Accept
                            </button>
                            <button
                              type="button"
                              className="btn btn-req-decline"
                              onClick={() => setConfirmAction({ type: "decline", request: req })}
                            >
                              <LuX size={16} /> Decline
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>

        <Modal show={!!confirmAction} onHide={() => !actionLoading && setConfirmAction(null)} centered>
          <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
            <Modal.Title className="fs-5 fw-bold mb-0">
              {confirmAction?.type === "accept" ? "Accept Connection" : "Decline Connection"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {confirmAction?.type === "accept" ? (
              <>Are you sure you want to accept the connection request from <strong>{senderName(confirmAction?.request)}</strong>?</>
            ) : (
              <>Are you sure you want to decline the connection request from <strong>{senderName(confirmAction?.request)}</strong>?</>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0">
            <button
              className="btn ino-button-gray-outline px-4"
              style={{ minWidth: "110px", height: "36px" }}
              onClick={() => setConfirmAction(null)}
              disabled={actionLoading}
            >
              Cancel
            </button>
            {confirmAction?.type === "accept" ? (
              <button
                className="btn ino-button px-4 d-flex justify-content-center align-items-center gap-1"
                style={{ minWidth: "110px", height: "36px" }}
                onClick={handleAccept}
                disabled={actionLoading}
              >
                {actionLoading && <span className="spinner-border spinner-border-sm" role="status" />}
                Accept
              </button>
            ) : (
              <button
                className="btn ino-button-red px-4 d-flex justify-content-center align-items-center gap-1"
                style={{ minWidth: "110px", height: "36px" }}
                onClick={handleDecline}
                disabled={actionLoading}
              >
                {actionLoading && <span className="spinner-border spinner-border-sm" role="status" />}
                Decline
              </button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default PendingRequestsPage;
