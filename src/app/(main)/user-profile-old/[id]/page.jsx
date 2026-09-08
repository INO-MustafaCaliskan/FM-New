"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Image from "next/image";
import client from "@/utils/client";
import moment from "moment-timezone";
import "./profile-page.css";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import NetworkersCreateSheduleModal from "@/components/GlobalNetworkers/NetworkersCreateSheduleModal"
import { useSignalR } from "@/context/SignalRContext2";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { useMeetingStore } from "@/context/MeetingContext";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Cookies from 'js-cookie';
import AuthRequiredModal from "@/components/AuthModal/AuthModal";
import { LuArrowRight } from "react-icons/lu";

export default function NetworkerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewId = searchParams.get('reviewId');
  const [userInfo, setUserInfo] = useState({});
  const makeInstantCall = useMeetingStore((state) => state.makeInstantCall);
  const { user } = useUser();
  const [scheduleModalShow, setScheduleModalShow] = useState(false)
  const isOwnProfile = user?.id === id;
  const safeText = (value) => value ?? "";
  const fullName = userInfo.firstName + " " + userInfo.lastName;
  const [writeAReview, setWriteAReview] = useState(false)
  const [reviewList, setReviewList] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)
  const [reviewPage, setReviewPage] = useState(1)
  const [hasMoreReviews, setHasMoreReviews] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [authModalShow, setAuthModalShow] = useState(false)
  const loadingRef = useRef(false)
  const hasMoreRef = useRef(true)
  const highlightedRef = useRef(null)
  const autoLoadedPagesRef = useRef(0)
  const signalRContext = useSignalR();
  const getQuickChatUser = signalRContext?.getQuickChatUser;

  const isUserAuthenticated = () => {
    const token = Cookies.get('accessToken');
    return !!token;
  };

  const handleMakeCall = () => {
    if (!isUserAuthenticated()) {
      setAuthModalShow(true);
      return;
    }
    if (userInfo)
      makeInstantCall({ fTalkId: userInfo.fTalkId, id: userInfo.id, firstName: userInfo.firstName, lastName: userInfo.lastName, imageUrl: userInfo.imageUrl });
  }

  const handleChatClick = () => {
    if (!isUserAuthenticated()) {
      setAuthModalShow(true);
      return;
    }
    if (getQuickChatUser && userInfo?.id) {
      getQuickChatUser(userInfo.id);
    }
  }

  const handleScheduleClick = () => {
    if (!isUserAuthenticated()) {
      setAuthModalShow(true);
      return;
    }
    setScheduleModalShow(true);
  }

  const formattedTimeZone = moment.tz(userInfo?.timeZone).format('Z');
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await client.get(
          `/User/GetOnlineNetworkerDetailById/${id}`,
        );
        setUserInfo(response.data.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, [id]);

  const loadReviews = useCallback(async (page = 1, append = false) => {
    if (!userInfo?.id || loadingRef.current) return;

    loadingRef.current = true;
    setLoadingReviews(true);

    try {
      const response = await client.get(
        `/UserReview/GetProfileReviewsByUser/${userInfo.id}`,
        {
          params: {
            pageNumber: page,
            pageSize: 10,
          },
        }
      );

      const newReviews = response.data.data.listItems || [];
      const totalPages = response.data.data.totalPage || 1;

      if (append) {
        setReviewList(prev => [...prev, ...newReviews]);
      } else {
        setReviewList(newReviews);
      }

      const hasMore = page < totalPages;
      setHasMoreReviews(hasMore);
      hasMoreRef.current = hasMore;
    } catch (error) {
      console.error("Review fetch error:", error);
    } finally {
      loadingRef.current = false;
      setLoadingReviews(false);
    }
  }, [userInfo?.id]);

  useEffect(() => {
    if (userInfo?.id) {
      setReviewPage(1);
      setReviewList([]);
      setHasMoreReviews(true);
      hasMoreRef.current = true;
      loadingRef.current = false;
      loadReviews(1, false);
    }
  }, [userInfo?.id, loadReviews]);

  const handleLoadMore = () => {
    setReviewPage(prevPage => {
      const nextPage = prevPage + 1;
      loadReviews(nextPage, true);
      return nextPage;
    });
  };

  useEffect(() => {
    if (!reviewId || reviewList.length === 0) return;
    const found = reviewList.find(r => r.id === reviewId);
    if (found && highlightedRef.current) {
      setTimeout(() => {
        highlightedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    } else if (!found && hasMoreReviews && !loadingRef.current && autoLoadedPagesRef.current < 5) {
      autoLoadedPagesRef.current += 1;
      setReviewPage(prev => {
        const next = prev + 1;
        loadReviews(next, true);
        return next;
      });
    }
  }, [reviewList, reviewId, hasMoreReviews, loadReviews]);



  const [replyingTo, setReplyingTo] = useState(null);
  const [replyComment, setReplyComment] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const deleteReply = async (replyId, reviewId) => {
    try {
      await client.get(`/UserReview/DeleteReply/${replyId}`);
      setReviewList(prev => prev.map(r => {
        if (r.id === reviewId) {
          return { ...r, replies: r.replies.filter(rep => rep.id !== replyId), replyCount: (r.replyCount || 1) - 1 };
        }
        return r;
      }));
      toast.success('Reply deleted successfully.');
    } catch (error) {
      console.error('Delete reply error:', error);
      toast.error('Failed to delete reply. Please try again.');
    }
  };

  const submitReply = async (e, reviewId) => {
    e.preventDefault();
    if (!replyComment.trim()) return;
    setReplyLoading(true);
    try {
      await client.post('/UserReview/ReplyToReview', {
        repliedReviewId: reviewId,
        comment: replyComment,
      });
      setReviewList(prev => prev.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            replies: [...(r.replies || []), {
              id: Date.now().toString(),
              comment: replyComment,
              createdDate: new Date().toISOString(),
              user: user,
            }],
            replyCount: (r.replyCount || 0) + 1,
          };
        }
        return r;
      }));
      setReplyComment('');
      setReplyingTo(null);
      toast.success('Reply submitted successfully!');
    } catch (error) {
      console.error('Reply error:', error);
      toast.error('Failed to submit reply. Please try again.');
    } finally {
      setReplyLoading(false);
    }
  };

  const [comment, setComment] = useState("");
  const [rate, setRate] = useState(3);
  const submitWriteAReview = useCallback(async (e) => {
    e.preventDefault();

    const payload = {
      toUserId: id,
      rate,
      comment,
    };

    try {
      await client.post("/UserReview/Add", payload);

      setComment("");
      setRate(0);
      setWriteAReview(false);
      toast.success("Your review has been submitted successfully!");

      // Refresh reviews
      if (userInfo?.id) {
        setReviewPage(1);
        setReviewList([]);
        setHasMoreReviews(true);
        hasMoreRef.current = true;
        loadingRef.current = false;
        loadReviews(1, false);
      }
    } catch (error) {
      console.error("Err", error);
      toast.error("Failed to submit review. Please try again.");
    }
  }, [id, rate, comment, userInfo?.id, loadReviews]);

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      await client.get(`/UserReview/Delete/${reviewToDelete}`);

      setReviewList(reviewList.filter(item => item.id !== reviewToDelete));
      setShowDeleteModal(false);
      setReviewToDelete(null);
      toast.success("Review deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete review. Please try again.");
    }
  };
  const setStatusClassName = (status) => {
    switch (status) {
      case 1:
        return "available";
      case 2:
        return "away";
      case 3:
        return "busy";
      default:
        return "offline";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <>
      <div className="container ">
        <InoBreadcrumb linkName={`${userInfo.firstName} ${userInfo.lastName}`} />
        <div className=" p-3 ">
          <div className=" d-flex row flex-wrap justify-content-between  ">
            <div className="col-lg-3 col-sm-12 ps-0">
              <div className="profile-sidebar">
                {/* Avatar */}
                <div className="profile-sidebar-avatar-wrap">
                  <div className="ft-profile-page-image">
                    {isUserAuthenticated() && (<i className={setStatusClassName(userInfo.onlineStatus)} />)}
                    <Image
                      src={userInfo.imageUrl || "/images/empty-image.png"}
                      alt="profile"
                      width={120}
                      height={120}
                      className="rounded-circle border"
                    />
                  </div>
                  <h5 className="profile-sidebar-name">{safeText(fullName)}</h5>
                  <p className="profile-sidebar-job">{safeText(userInfo.jobTitleName)}</p>
                  <p className="profile-sidebar-company">{safeText(userInfo.companyName)}</p>
                  <div className="profile-sidebar-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{safeText(userInfo.cityName)}{userInfo.cityName && userInfo.countryName ? ", " : ""}{safeText(userInfo.countryName)}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="profile-sidebar-divider" />

                {/* Meta info */}
                <div className="profile-sidebar-meta">
                  <div className="profile-meta-row">
                    <span className="profile-meta-label">Registration</span>
                    <span className="profile-meta-value">{formatDate(userInfo.registrationDate)}</span>
                  </div>
                  <div className="profile-meta-row">
                    <span className="profile-meta-label">FTalk ID</span>
                    <span className="profile-meta-value">{safeText(userInfo.fTalkId)}</span>
                  </div>
                  <div className="profile-meta-row">
                    <span className="profile-meta-label">Timezone</span>
                    <span className="profile-meta-value">GMT{safeText(formattedTimeZone)}</span>
                  </div>
                  <div className="profile-meta-row">
                    <span className="profile-meta-label"></span>
                    <span className="profile-meta-value profile-meta-tz">{safeText(userInfo.timeZone)}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="profile-sidebar-divider" />

                {/* Statistics */}
                <div className="profile-sidebar-stats">
                  <div className="profile-stat-item">
                    <span className="profile-stat-value">{userInfo.meetingCount ?? "—"}</span>
                    <span className="profile-stat-label">Meetings</span>
                  </div>
                  <div className="profile-stat-divider" />
                  <div className="profile-stat-item">
                    <span className="profile-stat-value">{userInfo.reviewAvg ?? "—"}</span>
                    <span className="profile-stat-label">Rating</span>
                  </div>
                  <div className="profile-stat-divider" />
                  <div className="profile-stat-item">
                    <span className="profile-stat-value">{userInfo.reviewCount ?? "—"}</span>
                    <span className="profile-stat-label">Reviews</span>
                  </div>
                </div>

                {/* Actions */}
                {!isOwnProfile && (
                  <>
                    <div className="profile-sidebar-divider" />
                    <div className="profile-sidebar-actions">
                      <button
                        onClick={handleScheduleClick}
                        className="btn ft-btn-message quick-message-chatbox-btn col-12 ino-button"
                      >
                        <div className="spinner-border quick-chat-spinner" role="status"></div>
                        SCHEDULE
                      </button>
                      <button
                        onClick={handleMakeCall}
                        className="btn ft-btn-call w-100 call-modal"
                      >
                        <div className="spinner-border quick-chat-spinner" role="status"></div>
                        CALL
                      </button>
                      <button
                        onClick={handleChatClick}
                        className="btn ino-chat-button col-12"
                      >
                        <div className="spinner-border quick-chat-spinner" role="status"></div>
                        CHAT
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-9 col-sm-12 ps-0 pe-0">
              <div className="profile-tabs-with-icons mt-3 mt-lg-0">
                <Tabs defaultActiveKey={reviewId || searchParams.get('tab') === 'reviews' ? "reviews" : "profile"} className="mb-3 tabs-with-line">
                  <Tab eventKey="profile" title="Profile">
                    <div className="d-flex flex-column gap-3">
                      <div className="profile-info-section">
                        <div className="profile-info-section-header">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <h6>My Biography</h6>
                        </div>
                        <p className="profile-info-section-body">{safeText(userInfo.biography) || <span className="profile-info-empty">No biography added yet.</span>}</p>
                      </div>
                      <div className="profile-info-section">
                        <div className="profile-info-section-header">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                          <h6>Company Introduction</h6>
                        </div>
                        <p className="profile-info-section-body">{safeText(userInfo.companyIntroduction) || <span className="profile-info-empty">No company introduction added yet.</span>}</p>
                        {userInfo.companyWebsite && (
                          <Link
                            href={
                              userInfo.companyWebsite.startsWith('http://') ||
                                userInfo.companyWebsite.startsWith('https://')
                                ? userInfo.companyWebsite
                                : `https://${userInfo.companyWebsite}`
                            }
                            className="profile-info-website"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="2" y1="12" x2="22" y2="12" />
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            {userInfo.companyWebsite}
                          </Link>
                        )}
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="reviews" title="Reviews">
                    <div className="reviews-tab-area">
                      <div className="reviews-tab-header">
                        <div className="reviews-tab-summary">
                          <span className="reviews-tab-count">{userInfo.reviewCount ?? 0} Reviews</span>
                          {userInfo.reviewAvg > 0 && (
                            <span className="reviews-tab-avg">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="14" height="14" color="#f59e0b">
                                <path fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                              </svg>
                              {userInfo.reviewAvg}
                            </span>
                          )}
                        </div>
                        {!isOwnProfile && (
                          <div className="write-button-box card-shadow">
                            {isUserAuthenticated() ? (
                              <button className="btn write-button" onClick={() => setWriteAReview(true)}>Write a Review</button>
                            ) : (
                              <div className="auth-review-actions">

                                <button
                                  className="btn ino-button"
                                  onClick={() => window.location.href = '/sign-up'}
                                >
                                  Sign up to write a review
                                  <LuArrowRight />
                                </button>

                                <button
                                  className="btn write-button-member write-button-member-signin "
                                  onClick={() => window.location.href = '/sign-in'}
                                >
                                  Already a member?   <span className="write-button-member-span">  Sign in</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        {
                          reviewList?.length > 0 ? (
                            reviewList.map((item) => (
                              <div
                                key={item.id}
                                className={`review-card mb-3 text-start${item.id === reviewId ? ' review-card-highlighted' : ''}`}
                                ref={item.id === reviewId ? highlightedRef : null}
                              >
                                <div className="review-card-header">
                                  <div className="review-avatar">
                                    {item.reviewerUser?.imageUrl ? (
                                      <Image
                                        src={item.reviewerUser.imageUrl}
                                        alt={`${item.reviewerUser?.firstName} ${item.reviewerUser?.lastName}`}
                                        width={40}
                                        height={40}
                                        className="rounded-circle"
                                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                      />
                                    ) : (
                                      <>
                                        {item.reviewerUser?.firstName?.[0]?.toUpperCase()}{item.reviewerUser?.lastName?.[0]?.toUpperCase()}
                                      </>
                                    )}
                                  </div>
                                  <div className="review-meta">
                                    <Link
                                      href={`/user-profile/${item.reviewerUser?.slug}`}
                                      className="review-author-name"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {item.reviewerUser?.firstName} {item.reviewerUser?.lastName}
                                    </Link>
                                    <div className="review-stars">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                          key={star}
                                          aria-hidden="true"
                                          focusable="false"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 576 512"
                                          width="14"
                                          height="14"
                                          color={star <= item.rate ? "#f59e0b" : "#d1d5db"}
                                        >
                                          <path
                                            fill="currentColor"
                                            d={
                                              star <= item.rate
                                                ? "M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                                : "M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"
                                            }
                                          />
                                        </svg>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="review-card-actions">
                                    <span className="review-date">
                                      {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })}
                                    </span>
                                    {item.reviewerUser?.id === user?.id && (
                                      <button
                                        onClick={() => handleDeleteClick(item.id)}
                                        className="review-delete-btn"
                                        title="Delete review"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <polyline points="3 6 5 6 21 6" />
                                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                          <path d="M10 11v6" />
                                          <path d="M14 11v6" />
                                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="review-comment">{item.comment}</p>
                                {item.replies?.length > 0 && (
                                  <div className="review-replies">
                                    {item.replies.map((reply) => (
                                      <div key={reply.id} className="review-reply-item">
                                        <div className="review-reply-header">
                                          <div className="review-reply-avatar">
                                            {reply.user?.imageUrl ? (
                                              <Image
                                                src={reply.user.imageUrl}
                                                alt={reply.user?.firstName ?? ''}
                                                width={28}
                                                height={28}
                                                className="rounded-circle"
                                                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                              />
                                            ) : (
                                              <>{reply.user?.firstName?.[0]?.toUpperCase()}{reply.user?.lastName?.[0]?.toUpperCase()}</>
                                            )}
                                          </div>
                                          <div className="review-reply-meta">
                                            <span className="review-reply-author">
                                              {reply.user?.firstName} {reply.user?.lastName}
                                            </span>
                                            <span className="review-reply-date">
                                              {formatDate(reply.createdDate)}
                                            </span>
                                          </div>
                                          {reply.user?.id === user?.id && (
                                            <button
                                              onClick={() => deleteReply(reply.id, item.id)}
                                              className="review-delete-btn ms-auto"
                                              title="Delete reply"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                <path d="M10 11v6" />
                                                <path d="M14 11v6" />
                                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                              </svg>
                                            </button>
                                          )}
                                        </div>
                                        <p className="review-reply-comment">{reply.comment}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {(isOwnProfile || item.reviewerUser?.id === user?.id) && (
                                  replyingTo === item.id ? (
                                    <form className="review-reply-form" onSubmit={(e) => submitReply(e, item.id)}>
                                      <textarea
                                        className="review-textarea review-reply-textarea"
                                        placeholder="Write your reply..."
                                        value={replyComment}
                                        onChange={(e) => setReplyComment(e.target.value.slice(0, 500))}
                                        rows={2}
                                        maxLength={500}
                                        required
                                        autoFocus
                                      />
                                      <div className="review-reply-actions">
                                        <button
                                          type="button"
                                          className="btn review-cancel-btn"
                                          onClick={() => { setReplyingTo(null); setReplyComment(''); }}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="submit"
                                          className="btn write-button-submit"
                                          disabled={replyLoading || !replyComment.trim()}
                                        >
                                          {replyLoading && <span className="spinner-border spinner-border-sm me-1" role="status" />}
                                          Reply
                                        </button>
                                      </div>
                                    </form>
                                  ) : (
                                    <button
                                      className="review-reply-btn"
                                      onClick={() => { setReplyingTo(item.id); setReplyComment(''); }}
                                    >
                                      Reply
                                    </button>
                                  )
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="reviews-empty-state">
                              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 576 512" fill="none">
                                <path fill="#e5e7eb" d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0z" />
                              </svg>
                              <p>No reviews yet.</p>
                              <span>Be the first to share your experience!</span>
                            </div>
                          )
                        }
                        {hasMoreReviews && reviewList?.length > 0 && (
                          <div className="d-flex justify-content-center my-3">
                            <div className="more-reviews-box card-shadow">
                              <button
                                className="btn write-button"
                                onClick={handleLoadMore}
                                disabled={loadingReviews}
                              >
                                {loadingReviews ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Loading...
                                  </>
                                ) : (
                                  'More Reviews'
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                        {!hasMoreReviews && reviewList?.length > 0 && (
                          <p className="text-muted text-center my-3">No more reviews</p>
                        )}
                      </div>
                    </div>
                  </Tab>
                  {/* <Tab eventKey="services" title="Services">
                    <div className="reviews-empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                      <p>No services listed yet.</p>
                    </div>
                  </Tab> */}
                </Tabs>
                <div className="d-flex justify-content-end mt-2 networker-schedule-icon-bar">
                  {userInfo.referralBadge && (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="referral-tooltip" className="referral-tooltip ">
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
                    </OverlayTrigger>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NetworkersCreateSheduleModal
        show={scheduleModalShow}
        handleClose={() => setScheduleModalShow(false)}
        userId={userInfo.id} />


      <Modal show={writeAReview} onHide={() => setWriteAReview(false)} centered>

        <Modal.Body className="review-modal-body">
          <form onSubmit={submitWriteAReview} id="reviewForm">
            <div className="review-rating-section">
              <p className="review-rating-label">Your Rating</p>
              <div className="review-star-picker">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    onClick={() => setRate(star)}
                    className="review-star-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    width="36"
                    height="36"
                    color={star <= rate ? "#f59e0b" : "#d1d5db"}
                  >
                    <path
                      fill="currentColor"
                      d={
                        star <= rate
                          ? "M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                          : "M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"
                      }
                    />
                  </svg>
                ))}
              </div>
              <p className="review-rating-hint">
                {rate === 1 && "Poor"}
                {rate === 2 && "Fair"}
                {rate === 3 && "Good"}
                {rate === 4 && "Very Good"}
                {rate === 5 && "Excellent"}
              </p>
            </div>
            <div className="review-comment-section">
              <label className="review-rating-label">Your Comment</label>
              <textarea
                className="review-textarea"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                rows={4}
                maxLength={500}
                required
              />
              <div className={`review-char-counter ${500 - comment.length <= 20 ? 'review-char-counter--warning' : ''}`}>
                {500 - comment.length} characters remaining
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="review-modal-footer">
          <button className="btn review-cancel-btn" onClick={() => setWriteAReview(false)}>
            Cancel
          </button>
          <button className="btn write-button-submit" type="submit" form="reviewForm" disabled={rate === 0}>
            Submit Review
          </button>
        </Modal.Footer>
      </Modal>


      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>

        <Modal.Body className="review-modal-body">
          <div className="delete-modal-content">
            <div className="delete-modal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <p className="delete-modal-text">Are you sure you want to delete this review?</p>
            <p className="delete-modal-subtext">This action cannot be undone.</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="review-modal-footer">
          <button className="btn review-cancel-btn" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
          <button className="btn delete-confirm-btn" onClick={confirmDelete}>
            Delete Review
          </button>
        </Modal.Footer>
      </Modal>
      <AuthRequiredModal
        show={authModalShow}
        onClose={() => setAuthModalShow(false)}
      />
    </>
  );
}
