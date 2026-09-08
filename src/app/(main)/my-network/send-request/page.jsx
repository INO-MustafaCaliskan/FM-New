"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Container, Card, Spinner, Modal } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { LuArrowLeft, LuX, LuBuilding2 } from "react-icons/lu";
import { PiClockUserLight } from "react-icons/pi";
import { BsPeopleFill } from "react-icons/bs";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import ProfileSidebar from "@/components/ProfileSidebar/ProfileSidebar";
import NetworkNavTabs from "@/components/MyNetworks/NetworkNavTabs";
import { useUser } from "@/context/UserContext";
import client from "@/utils/client";
import "./awaiting-request.css";

const AwaitingRequestsPage = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAwaitingRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await client.get("/NetworkConnection/AwaitingRequests");
      if (response.data?.success) {
        setRequests(response.data.data ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch awaiting requests:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAwaitingRequests();
  }, [fetchAwaitingRequests]);

  const handleCancelRequest = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      const response = await client.post(`/NetworkConnection/CancelRequest/${confirmAction.id}`);
      if (response.data?.success) {
        toast.info("Connection request cancelled.");
        setRequests((prev) => prev.filter((r) => r.id !== confirmAction.id));
      } else {
        toast.error(response.data?.message || "Failed to cancel request.");
      }
    } catch (err) {
      toast.error("Failed to cancel request.");
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  // API response: req.receiver.fullName, req.receiver.imageUrl, req.receiver.companyName, req.receiver.jobTitle, req.receiver.slug
  const getReceiver = (req) => req?.receiver ?? {};
  const receiverName = (req) =>
    getReceiver(req)?.fullName ||
    `${getReceiver(req)?.firstName ?? ""} ${getReceiver(req)?.lastName ?? ""}`.trim() ||
    "Unknown";

  return (
    <div className="send-requests-page">
      <Container className="py-2 py-md-3">
        <InoBreadcrumb linkName="Send Requests" />
        <div className="row g-3 g-xl-4 justify-content-between">
          <div className="col-xl-3 col-12">
            <div
              className="d-flex flex-column gap-3"
              style={{ position: "sticky", top: "16px" }}
            >
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
                <h4 className="fw-bold text-dark mb-1 fs-5">Send Requests</h4>
                <p className="text-secondary mb-0 small">
                  Connection requests you sent that are still waiting for a
                  response.
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
                    <BsPeopleFill
                      size={48}
                      className="mb-3"
                      style={{ color: "#d1d5db" }}
                    />
                    <h6 className="fw-semibold text-dark mb-1">
                      No awaiting requests
                    </h6>
                    <p className="text-muted small mb-0">
                      You have no outgoing connection requests pending a response.
                    </p>
                  </div>
                ) : (
                  <div>
                    {requests.map((req) => {
                      const receiver = getReceiver(req);
                      const profileUrl = receiver.slug
                        ? `/user-profile/${receiver.slug}`
                        : "#";

                      return (
                        <div key={req.id} className="request-item">
                          <div className="request-user-info">
                            <div className="request-avatar-wrap">
                              <Link href={profileUrl}>
                                <Image
                                  src={
                                    receiver.imageUrl || "/images/empty-image.png"
                                  }
                                  alt={receiverName(req)}
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
                                {receiverName(req)}
                              </Link>

                              {receiver.companyName && (
                                <div className="request-meta-text">
                                  <LuBuilding2 size={13} className="text-muted flex-shrink-0" />
                                  <span className="text-truncate">{receiver.companyName}</span>
                                </div>
                              )}

                              {receiver.jobTitle && (
                                <div className="request-meta-text">
                                  <span className="text-truncate">{receiver.jobTitle}</span>
                                </div>
                              )}

                              {receiver.categoryName && (
                                <div className="request-meta-text mt-1">
                                  <span
                                    className="badge bg-light text-secondary border px-2 py-1"
                                    style={{ fontSize: "0.72rem", fontWeight: 500 }}
                                  >
                                    {receiver.categoryName}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="request-actions">
                            <span className="status-badge-awaiting">
                              <PiClockUserLight size={17} />
                              <span>Awaiting Response</span>
                            </span>
                            <button
                              type="button"
                              className="btn btn-req-cancel"
                              onClick={() => setConfirmAction(req)}
                            >
                              <LuX size={16} /> Cancel 
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
              Cancel Connection Request
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to cancel the connection request sent to <strong>{receiverName(confirmAction)}</strong>?
          </Modal.Body>
          <Modal.Footer className="border-0">
            <button
              className="btn ino-button-gray-outline px-4"
              style={{ minWidth: "110px", height: "36px" }}
              onClick={() => setConfirmAction(null)}
              disabled={actionLoading}
            >
              Keep
            </button>
            <button
              className="btn ino-button-red px-4 d-flex justify-content-center align-items-center gap-1"
              style={{ minWidth: "110px", height: "36px" }}
              onClick={handleCancelRequest}
              disabled={actionLoading}
            >
              {actionLoading && <span className="spinner-border spinner-border-sm" role="status" />}
              Cancel Request
            </button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AwaitingRequestsPage;