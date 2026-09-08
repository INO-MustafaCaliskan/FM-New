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
import "./profile-page-new.css";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import NetworkersCreateSheduleModal from "@/components/GlobalNetworkers/NetworkersCreateSheduleModal";
import EmptyState from "@/components/EmptyState/EmptyState";
import ProfileSidebar from "@/components/ProfileSidebar/ProfileSidebar";
import { useSignalR } from "@/context/SignalRContext2";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { useMeetingStore } from "@/context/MeetingContext";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Cookies from "js-cookie";
import AuthRequiredModal from "@/components/AuthModal/AuthModal";
import { LuArrowRight } from "react-icons/lu";
import { FiGlobe, FiUsers, FiCalendar, FiMapPin } from "react-icons/fi";
import { WorldMap } from "react-svg-worldmap";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { FaShip, FaPlane, FaTruck, FaTrain, FaBoxes, FaBox } from "react-icons/fa";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { TfiWorld } from "react-icons/tfi";
import { IoInvertMode } from "react-icons/io5";
import { TbPercentage25 } from "react-icons/tb";
import { BiNetworkChart } from "react-icons/bi";
import { MdOutlineDesignServices } from "react-icons/md";
import {
  FaRoute,
  FaTruckFast,
  FaCapsules,
  FaTemperatureLow,
  FaAppleWhole,
  FaTriangleExclamation,
  FaFlask,
  FaPaw,
  FaCar,
  FaAnchor,
  FaWeightHanging,
  FaCalendarDays,
  FaStamp,
  FaLayerGroup,
  FaWarehouse,
  FaClock,
  FaTruckMoving,
  FaDiagramProject,
  FaCartShopping,
  FaRightLeft,
  FaPeopleGroup,
  FaCertificate,
  FaGears,
} from "react-icons/fa6";

import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(ArcElement, ChartTooltip, Legend, ChartDataLabels);

import { Doughnut } from "react-chartjs-2";

export default function NetworkerProfilePage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewId = searchParams.get("reviewId");
  const [userInfo, setUserInfo] = useState({});
  const [activeTab, setActiveTab] = useState("profile");
  const makeInstantCall = useMeetingStore((state) => state.makeInstantCall);
  const { user } = useUser();
  const [scheduleModalShow, setScheduleModalShow] = useState(false);
  const isOwnProfile = user?.slug === slug;
  const safeText = (value) => value ?? "";
  const [writeAReview, setWriteAReview] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [authModalShow, setAuthModalShow] = useState(false);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const highlightedRef = useRef(null);
  const autoLoadedPagesRef = useRef(0);
  const signalRContext = useSignalR();
  const getQuickChatUser = signalRContext?.getQuickChatUser;
  const [profileData, setProfileData] = useState(null);
  countries.registerLocale(en);
  const worldMapData =
    profileData?.globalCoverage?.top6Markets
      ?.map((item) => {
        const code = countries.getAlpha2Code(item.name, "en");

        if (!code) return null;

        return {
          country: code.toLowerCase(),
          value: 1,
        };
      })
      .filter(Boolean) || [];

  useEffect(() => {
    setActiveTab(
      reviewId || searchParams.get("tab") === "reviews" ? "reviews" : "profile",
    );
  }, [reviewId, searchParams]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "40",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#374151",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        callbacks: {
          label(context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
      datalabels: {
        color: "#ffffff",
        font: {
          size: 14,
          weight: "bold",
        },
      },
    },
  };
  const EXTENDED_PROFILE_CATEGORIES = [
    "3PLs & Logistics Services",
    "Freight Forwarder",
    "Customs Broker",
    "Maritime Transport",
    "Transportation",
  ];

  const isExtendedProfileFlow = (categoryName) =>
    Boolean(categoryName) && EXTENDED_PROFILE_CATEGORIES.includes(categoryName);

  const isExtendedFlow = isOwnProfile
    ? isExtendedProfileFlow(user?.categoryName)
    : isExtendedProfileFlow(userInfo?.categoryName);

  const serviceColumns = [
    {
      title: "Transport Modes",
      subtitle: "Multiple transport options to move your cargo globally.",
      colorClass: "svc-group-transport",
      headerIcon: FaTruckFast,
      items: [
        { key: "roadFreightService", label: "Road Freight", icon: FaTruck },
        { key: "railFreightService", label: "Rail Freight", icon: FaTrain },
        { key: "seaFreightService", label: "Sea Freight", icon: FaShip },
        { key: "airFreightService", label: "Air Freight", icon: FaPlane },
        { key: "multimodalTransport", label: "Multimodal Transport", icon: FaRoute },
        { key: "fclServices", label: "FCL Services", icon: FaBoxes },
        { key: "lclServices", label: "LCL Services", icon: FaBox },
      ],
    },
    {
      title: "Specialized Solutions",
      subtitle: "Industry-focused expertise for your unique cargo requirements.",
      colorClass: "svc-group-specialized",
      headerIcon: FaCertificate,
      items: [
        { key: "pharma", label: "Pharma", icon: FaCapsules },
        { key: "coldChain", label: "Cold Chain", icon: FaTemperatureLow },
        { key: "perishables", label: "Perishables", icon: FaAppleWhole },
        { key: "dangerousGoods", label: "Dangerous Goods", icon: FaTriangleExclamation },
        { key: "chemicals", label: "Chemicals", icon: FaFlask },
        { key: "liveAnimals", label: "Live Animals", icon: FaPaw },
        { key: "automotiveLogistics", label: "Automotive Logistics", icon: FaCar },
        { key: "marineLogistics", label: "Marine Logistics", icon: FaAnchor },
        { key: "projectCargoHeavyLift", label: "Project Cargo / Heavy Lift", icon: FaWeightHanging },
        { key: "exhibitionEventsLogistics", label: "Exhibition & Events Logistics", icon: FaCalendarDays },
      ],
    },
    {
      title: "Service Types",
      subtitle: "End-to-end services to streamline your logistics operations.",
      colorClass: "svc-group-service",
      headerIcon: FaGears,
      items: [
        { key: "customsClearance", label: "Customs Clearance", icon: FaStamp },
        { key: "integratedLogistics", label: "Integrated Logistics", icon: FaLayerGroup },
        { key: "warehousing", label: "Warehousing", icon: FaWarehouse },
        { key: "timeCritical", label: "Time Critical", icon: FaClock },
        { key: "relocations", label: "Relocations", icon: FaTruckMoving },
        { key: "projectLogistics", label: "Project Logistics", icon: FaDiagramProject },
        { key: "eCommerceLogisticsService", label: "E-commerce Logistics", icon: FaCartShopping },
        { key: "crossTrade", label: "Cross Trade", icon: FaRightLeft },
        { key: "buyerConsolidation", label: "Buyer Consolidation", icon: FaPeopleGroup },
      ],
    },
  ];

  const isUserAuthenticated = () => {
    const token = Cookies.get("accessToken");
    return !!token;
  };

  const handleMakeCall = () => {
    if (!isUserAuthenticated()) {
      setAuthModalShow(true);
      return;
    }
    if (userInfo)
      makeInstantCall({
        fTalkId: userInfo.fTalkId,
        id: userInfo.id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        imageUrl: userInfo.imageUrl,
      });
  };

  const handleChatClick = () => {
    if (!isUserAuthenticated()) {
      setAuthModalShow(true);
      return;
    }
    if (getQuickChatUser && userInfo?.id) {
      getQuickChatUser(userInfo.id);
    }
  };

  const handleScheduleClick = () => {
    if (!isUserAuthenticated()) {
      setAuthModalShow(true);
      return;
    }
    setScheduleModalShow(true);
  };

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const response = await client.get(
          `/User/GetOnlineNetworkerDetailById/${slug}`,
        );

        setUserInfo(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await client.get(`/User/GetProfileById/${slug}`);
        setProfileData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchProfile();
  }, [slug]);

  useEffect(() => {
    if(user && userInfo?.id && user.id !== userInfo.id){
      client.post(`/User/VisitEvent/${userInfo.id}`);
    }
  }, [user, userInfo])

  const loadReviews = useCallback(
    async (page = 1, append = false) => {
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
          },
        );

        const newReviews = response.data.data.listItems || [];
        const totalPages = response.data.data.totalPage || 1;

        if (append) {
          setReviewList((prev) => [...prev, ...newReviews]);
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
    },
    [userInfo?.id],
  );

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
    setReviewPage((prevPage) => {
      const nextPage = prevPage + 1;
      loadReviews(nextPage, true);
      return nextPage;
    });
  };

  useEffect(() => {
    if (!reviewId || reviewList.length === 0) return;
    const found = reviewList.find((r) => r.id === reviewId);
    if (found && highlightedRef.current) {
      setTimeout(() => {
        highlightedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    } else if (
      !found &&
      hasMoreReviews &&
      !loadingRef.current &&
      autoLoadedPagesRef.current < 5
    ) {
      autoLoadedPagesRef.current += 1;
      setReviewPage((prev) => {
        const next = prev + 1;
        loadReviews(next, true);
        return next;
      });
    }
  }, [reviewList, reviewId, hasMoreReviews, loadReviews]);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyComment, setReplyComment] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const deleteReply = async (replyId, reviewId) => {
    try {
      await client.get(`/UserReview/DeleteReply/${replyId}`);
      setReviewList((prev) =>
        prev.map((r) => {
          if (r.id === reviewId) {
            return {
              ...r,
              replies: r.replies.filter((rep) => rep.id !== replyId),
              replyCount: (r.replyCount || 1) - 1,
            };
          }
          return r;
        }),
      );
      toast.success("Reply deleted successfully.");
    } catch (error) {
      console.error("Delete reply error:", error);
      toast.error("Failed to delete reply. Please try again.");
    }
  };

  const submitReply = async (e, reviewId) => {
    e.preventDefault();
    if (!replyComment.trim()) return;
    setReplyLoading(true);
    try {
      await client.post("/UserReview/ReplyToReview", {
        repliedReviewId: reviewId,
        comment: replyComment,
      });
      setReviewList((prev) =>
        prev.map((r) => {
          if (r.id === reviewId) {
            return {
              ...r,
              replies: [
                ...(r.replies || []),
                {
                  id: Date.now().toString(),
                  comment: replyComment,
                  createdDate: new Date().toISOString(),
                  user: user,
                },
              ],
              replyCount: (r.replyCount || 0) + 1,
            };
          }
          return r;
        }),
      );
      setReplyComment("");
      setReplyingTo(null);
      toast.success("Reply submitted successfully!");
    } catch (error) {
      console.error("Reply error:", error);
      toast.error("Failed to submit reply. Please try again.");
    } finally {
      setReplyLoading(false);
    }
  };

  const [comment, setComment] = useState("");
  const [rate, setRate] = useState(3);
  const submitWriteAReview = useCallback(
    async (e) => {
      e.preventDefault();

      const payload = {
        toUserId: slug,
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
    },
    [slug, rate, comment, userInfo?.id, loadReviews],
  );

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      await client.get(`/UserReview/Delete/${reviewToDelete}`);

      setReviewList(reviewList.filter((item) => item.id !== reviewToDelete));
      setShowDeleteModal(false);
      setReviewToDelete(null);
      toast.success("Review deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete review. Please try again.");
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

  const hasGlobalCoverage =
    (profileData?.globalCoverage?.howManyCountriesDoYouServe ?? 0) > 0 ||
    (profileData?.globalCoverage?.top6Markets?.length ?? 0) > 0;

  const verifiedMemberships = [
    {
      show: profileData?.businessProfile?.isFFFMember,
      name: "Freight Forwarders Family Worldwide Agents Network",
    },
    {
      show: profileData?.businessProfile?.isFMMember,
      name: "Freight Midpoint International Forwarders Network",
    },
    {
      show: profileData?.businessProfile?.isOPCAMember,
      name: "Overseas Project Cargo Association",
    },
    {
      show: profileData?.businessProfile?.isCLNMember,
      name: "Combined Logistics Networks",
    },
    {
      show: profileData?.businessProfile?.isGLAMember,
      name: "GLA Global Logistics Alliance",
    },
    {
      show: profileData?.businessProfile?.isOLOMember,
      name: "OLO Orange Logistics Organization",
    },
    {
      show: profileData?.businessProfile?.isX2Member,
      name: "X2 Logistics Networks",
    },
    {
      show: profileData?.businessProfile?.isJCtransMember,
      name: "JCtrans",
    },
    {
      show: profileData?.businessProfile?.isWCAworldMember,
      name: "WCAworld",
    },
    {
      show: profileData?.businessProfile?.isFNCMember,
      name: "FNC Freight Network Corporation",
    },
  ].filter((item) => item.show);

  const whyPeopleConnect = [
    {
      value: profileData?.businessProfile?.reliableOverseasPartnerships,
      label: "Reliable Overseas Partnerships",
    },
    {
      value: profileData?.businessProfile?.fastCompetitiveQuotations,
      label: "Fast & Competitive Quotations",
    },
    {
      value: profileData?.businessProfile?.strongLocalMarketExpertise,
      label: "Strong Local Market Expertise",
    },
    {
      value: profileData?.businessProfile?.importExportSolutions,
      label: "Import & Export Solutions",
    },
    {
      value: profileData?.businessProfile?.projectCargoExpertise,
      label: "Project Cargo Expertise",
    },
    {
      value: profileData?.businessProfile?.crossTradeSolutions,
      label: "Cross Trade Solutions",
    },
    {
      value: profileData?.businessProfile?.customsComplianceSupport,
      label: "Customs & Compliance Support",
    },
    {
      value: profileData?.businessProfile?.warehousingDistributionServices,
      label: "Warehousing & Distribution Services",
    },
    {
      value: profileData?.businessProfile?.industrySpecificLogisticsExpertise,
      label: "Industry-Specific Logistics Expertise",
    },
    {
      value: profileData?.businessProfile?.responsiveProfessionalCommunication,
      label: "Responsive & Professional Communication",
    },
  ].filter((item) => item.value);

  const interestedIn = [
    {
      value: profileData?.businessProfile?.newAgencyPartnerships,
      label: "New Agency Partnerships",
    },
    {
      value: profileData?.businessProfile?.importOpportunities,
      label: "Import Opportunities",
    },
    {
      value: profileData?.businessProfile?.exportOpportunities,
      label: "Export Opportunities",
    },
    {
      value: profileData?.businessProfile?.crossTradeBusiness,
      label: "Cross Trade Business",
    },
    {
      value: profileData?.businessProfile?.projectCargoOpportunities,
      label: "Project Cargo Opportunities",
    },
    {
      value: profileData?.businessProfile?.rfqsFreightQuotations,
      label: "RFQs & Freight Quotations",
    },
    {
      value: profileData?.businessProfile?.jointBusinessDevelopment,
      label: "Joint Business Development",
    },
    {
      value: profileData?.businessProfile?.warehousingDistributionPartners,
      label: "Warehousing & Distribution Partners",
    },
    {
      value: profileData?.businessProfile?.customsBrokeragePartners,
      label: "Customs Brokerage Partners",
    },
    {
      value: profileData?.businessProfile?.industrySpecificLogisticsOpportunities,
      label: "Industry-Specific Logistics Opportunities",
    },
  ].filter((item) => item.value);

  const hasModesData =
    (profileData?.businessStatistics?.seaFreightPercentage ?? 0) +
    (profileData?.businessStatistics?.airFreightPercentage ?? 0) +
    (profileData?.businessStatistics?.roadFreightPercentage ?? 0) +
    (profileData?.businessStatistics?.railFreightPercentage ?? 0) >
    0;

  const hasBusinessData =
    (profileData?.businessStatistics?.exportPercentage ?? 0) +
    (profileData?.businessStatistics?.importPercentage ?? 0) >
    0;

  const hasSourceData =
    (profileData?.businessStatistics?.partnersPercentage ?? 0) +
    (profileData?.businessStatistics?.ownCustomersPercentage ?? 0) >
    0;

  return (
    <>
      <div className="container ">
        <InoBreadcrumb
          linkName={`${userInfo.firstName} ${userInfo.lastName}`}
        />
        <div className=" p-3 ">
          <div className=" d-flex row flex-wrap justify-content-between  ">
            <div className="col-lg-3 col-sm-12 ps-0">
              <ProfileSidebar
                userInfo={userInfo}
                onScheduleClick={handleScheduleClick}
                onCallClick={handleMakeCall}
                onChatClick={handleChatClick}
              />
            </div>
            <div className="col-lg-9 col-sm-12 ps-0 pe-0">
              <div className="profile-tabs-with-icons mt-3 mt-lg-0">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(key) => setActiveTab(key)}
                  className="mb-3 tabs-with-line"
                >
                  <Tab eventKey="profile" title="Profile">
                    <div className="d-flex flex-column gap-3">
                      <div className="profile-info-section">
                        <div className="profile-info-section-header">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <h6>My Biography</h6>
                        </div>
                        <p className="profile-info-section-body">
                          {safeText(
                            profileData?.personalInformation?.biography,
                          ) || (
                              <span className="profile-info-empty">
                                No biography added yet.
                              </span>
                            )}
                        </p>
                      </div>
                      <div className="profile-info-section">
                        <div className="profile-info-section-header">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="2"
                              y="7"
                              width="20"
                              height="14"
                              rx="2"
                              ry="2"
                            />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>

                          <h6>Company Introduction</h6>
                        </div>
                        <div className="company-introduction-layout">
                          {/* Sol taraf - Logo */}
                          <div className="company-logo-box">
                            <img
                              src={
                                profileData?.companyInformation?.imageUrl || "/images/no-photo.png"}
                              alt="Company Logo"
                            />
                          </div>

                          <div className="company-intro-content">
                            <p className="profile-info-section-body">
                              {safeText(
                                profileData?.companyInformation?.introduction,
                              ) || (
                                  <span className="profile-info-empty">
                                    No company introduction added yet.
                                  </span>
                                )}
                            </p>

                            {profileData?.companyInformation?.website && (
                              <div className="company-website-row">
                                <span className="website-label">
                                  Please visit our corporate website:
                                </span>

                                <Link
                                  href={
                                    profileData.companyInformation.website.startsWith(
                                      "http",
                                    )
                                      ? profileData.companyInformation.website
                                      : `https://${profileData.companyInformation.website}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="website-link"
                                >
                                  {profileData.companyInformation.website}
                                </Link>
                              </div>
                            )}

                            <div className="company-info-bar">
                              <div className="info-item">
                                <FiGlobe className="info-icon" />

                                <div className="info-text">
                                  <span className="info-title">Website</span>

                                  <a
                                    href={
                                      profileData?.companyInformation?.website?.startsWith(
                                        "http",
                                      )
                                        ? profileData.companyInformation.website
                                        : `https://${profileData?.companyInformation?.website}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="website-footer-link"
                                  >
                                    {profileData?.companyInformation?.website ||
                                      "-"}
                                  </a>
                                </div>
                              </div>

                              <div className="info-divider" />

                              <div className="info-item">
                                <FiUsers className="info-icon" />

                                <div className="info-text">
                                  <span className="info-title">
                                    Company Size
                                  </span>

                                  <strong>
                                    {profileData?.companyInformation?.size ||
                                      "-"}
                                  </strong>
                                </div>
                              </div>

                              <div className="info-divider" />

                              <div className="info-item">
                                <FiCalendar className="info-icon" />

                                <div className="info-text">
                                  <span className="info-title">
                                    Founded Year
                                  </span>

                                  <strong>
                                    {profileData?.companyInformation
                                      ?.foundedYear || "-"}
                                  </strong>
                                </div>
                              </div>

                              <div className="info-divider" />

                              <div className="info-item">
                                <FiMapPin className="info-icon" />

                                <div className="info-text">
                                  <span className="info-title">
                                    Head Office Country
                                  </span>

                                  <strong>
                                    {profileData?.companyInformation
                                      ?.headOfficeCountryName || "-"}
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {isExtendedFlow && (
                        <>
                          <div className="company-two-cards">
                            <div className="profile-info-section">
                              <div className="profile-info-section-header">
                                <div className="d-flex justify-content-between align-items-center w-100">
                                  <div className="review-title">
                                    <FaRegStar className="review-title-icon" />
                                    <h6>Top Reviews</h6>
                                  </div>

                                  <Link
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setActiveTab("reviews");
                                    }}
                                  >
                                    View All Reviews <FiArrowRight />
                                  </Link>
                                </div>
                              </div>

                              <div className="company-review-list">
                                {profileData?.topReviews?.length > 0 ? (
                                  profileData.topReviews
                                    .slice(0, 2)
                                    .map((item) => (
                                      <div
                                        className="company-review-item"
                                        key={item.id}
                                      >
                                        <Image
                                          src={
                                            item?.fromUserImageUrl ||
                                            "/images/empty-image.png"
                                          }
                                          alt={item?.fromUserName || "-"}
                                          width={52}
                                          height={52}
                                          className="rounded-circle"
                                        />

                                        <div className="review-content">
                                          <div className="company-stars">
                                            {[1, 2, 3, 4, 5].map((star) =>
                                              star <= item.rate ? (
                                                <FaStar
                                                  key={star}
                                                  className="filled-star"
                                                />
                                              ) : (
                                                <FaRegStar
                                                  key={star}
                                                  className="empty-star"
                                                />
                                              ),
                                            )}
                                          </div>

                                          <p className="review-content-p">
                                            "{item?.comment || "-"}"
                                          </p>

                                          <span className="review-user">
                                            - {item.fromUserName},{" "}
                                            {item.fromUserCountryName}
                                          </span>
                                        </div>
                                      </div>
                                    ))
                                ) : (
                                  <EmptyState
                                    title="No reviews yet."
                                    description="This company has not received any reviews yet."
                                  />
                                )}
                              </div>
                            </div>

                            <div className="profile-info-section">
                              <div className="profile-info-section-header">
                                <TfiWorld />
                                <h6>Global Coverage</h6>
                              </div>

                              {hasGlobalCoverage ? (
                                <div className="coverage-box">
                                  <div className="coverage-map">
                                    <WorldMap
                                      data={worldMapData}
                                      color="#EF6C00"
                                      backgroundColor="#ffffff"
                                      size="responsive"
                                      valueSuffix=""
                                    />
                                  </div>

                                  <div className="coverage-info">
                                    <div className="coverage-title d-flex flex-column gap-1 align-items-center justify-content-start">
                                      <h2>
                                        {profileData?.globalCoverage
                                          ?.howManyCountriesDoYouServe ?? 0}
                                      </h2>

                                      <span>Countries Served</span>
                                    </div>

                                    <div className="d-flex flex-column align-items-start ml-2">
                                      <p className="mb-2">Top 6 Markets</p>

                                      <div className="coverage-markets">
                                        {profileData?.globalCoverage?.top6Markets?.map(
                                          (market) => (
                                            <span
                                              className="coverage-market-item"
                                              key={market.id}
                                            >
                                              <img
                                                src={market.flag}
                                                alt={market.name}
                                                width={20}
                                                height={20}
                                              />

                                              <span>{market.name}</span>
                                            </span>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <EmptyState
                                  title="No global coverage information."
                                  description="Global coverage details have not been provided yet."
                                />
                              )}
                            </div>
                          </div>
                          <div className="business-profile-cards-grid">
                            {/* VERIFIED MEMBERSHIPS */}
                            <div className="profile-info-section business-profile-card">
                              <div className="profile-info-section-header">
                                <div className="business-profile-title">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="M9 12l2 2 4-4" />
                                  </svg>

                                  <h6>Verified Network Memberships</h6>
                                </div>
                              </div>

                              <div className="business-profile-list">
                                {verifiedMemberships.length > 0 ? (
                                  verifiedMemberships.map((item) => (
                                    <div
                                      className="business-profile-item"
                                      key={item.name}
                                    >
                                      <div className="business-profile-left">
                                        <div className="business-profile-success">
                                          ✓
                                        </div>
                                        <span title={item.name?.length > 30 ? item.name : undefined}>
                                          {item.name?.length > 30 ? `${item.name.slice(0, 30)}...` : item.name}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <EmptyState
                                    type="membership"
                                    title="No verified network memberships yet."
                                    description="This company is currently not a member of any verified logistics network."
                                  />
                                )}
                              </div>
                            </div>

                            {/* WHY PEOPLE CONNECT */}
                            <div className="profile-info-section business-profile-card">
                              <div className="profile-info-section-header">
                                <div className="business-profile-title">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                  </svg>

                                  <h6>Why People Connect With Me</h6>
                                </div>
                              </div>
                              <div className="business-profile-list">
                                {whyPeopleConnect.length > 0 ? (
                                  whyPeopleConnect.map((item) => {
                                    const isTruncated = item.label.length > 40;
                                    const displayText = isTruncated
                                      ? `${item.label.slice(0, 40)}...`
                                      : item.label;

                                    const content = (
                                      <div
                                        className="business-profile-item"
                                        key={item.label}
                                      >
                                        <div className="business-profile-check business-profile-check-green">
                                          ✓
                                        </div>

                                        <span>{displayText}</span>
                                      </div>
                                    );

                                    return isTruncated ? (
                                      <OverlayTrigger
                                        key={item.label}
                                        placement="top"
                                        overlay={<Tooltip>{item.label}</Tooltip>}
                                      >
                                        {content}
                                      </OverlayTrigger>
                                    ) : (
                                      content
                                    );
                                  })
                                ) : (
                                  <EmptyState
                                    title="No information available yet."
                                    description="This section has not been filled in yet."
                                  />
                                )}
                              </div>
                            </div>

                            {/* INTERESTED IN */}
                            <div className="profile-info-section business-profile-card">
                              <div className="profile-info-section-header">
                                <div className="business-profile-title">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="6" />
                                    <circle cx="12" cy="12" r="2" />
                                  </svg>

                                  <h6>Interested In</h6>
                                </div>
                              </div>

                              <div className="business-profile-list">
                                {interestedIn.length > 0 ? (
                                  interestedIn.map((item) => {
                                    const isTruncated = item.label.length > 40;
                                    const displayText = isTruncated
                                      ? `${item.label.slice(0, 40)}...`
                                      : item.label;

                                    const content = (
                                      <div
                                        className="business-profile-item"
                                        key={item.label}
                                      >
                                        <div className="business-profile-check business-profile-check-orange">
                                          ✓
                                        </div>

                                        <span>{displayText}</span>
                                      </div>
                                    );

                                    return isTruncated ? (
                                      <OverlayTrigger
                                        key={item.label}
                                        placement="top"
                                        overlay={<Tooltip>{item.label}</Tooltip>}
                                      >
                                        {content}
                                      </OverlayTrigger>
                                    ) : (
                                      content
                                    );
                                  })
                                ) : (
                                  <EmptyState
                                    title="No interests added yet."
                                    description="This company hasn't shared any business interests yet."
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="npbs-grid">
                            {/* Percentage of Modes */}
                            <div className="profile-info-section npbs-card">
                              <div className="profile-info-section-header">
                                <IoInvertMode />
                                <h6>Percentage Of Modes</h6>
                              </div>

                              {hasModesData ? (
                                <>
                                  <div className="npbs-legend">
                                    <span>
                                      <i className="sea"></i>Sea Freight
                                    </span>
                                    <span>
                                      <i className="air"></i>Air Freight
                                    </span>
                                    <span>
                                      <i className="road"></i>Road Freight
                                    </span>
                                    <span>
                                      <i className="rail"></i>Rail Freight
                                    </span>
                                  </div>

                                  <div className="npbs-chart">
                                    <Doughnut
                                      data={{
                                        labels: [
                                          "Sea Freight",
                                          "Air Freight",
                                          "Road Freight",
                                          "Rail Freight",
                                        ],
                                        datasets: [
                                          {
                                            data: [
                                              profileData?.businessStatistics
                                                ?.seaFreightPercentage || 0,
                                              profileData?.businessStatistics
                                                ?.airFreightPercentage || 0,
                                              profileData?.businessStatistics
                                                ?.roadFreightPercentage || 0,
                                              profileData?.businessStatistics
                                                ?.railFreightPercentage || 0,
                                            ],
                                            backgroundColor: [
                                              "#f94144",
                                              "#f3722c",
                                              "#f9c74f",
                                              "#f8961e",
                                            ],
                                            borderWidth: 0,
                                          },
                                        ],
                                      }}
                                      options={chartOptions}
                                    />
                                  </div>
                                </>
                              ) : (
                                <EmptyState
                                  title="No statistics available."
                                  description="Transportation mode distribution has not been provided yet."
                                />
                              )}
                            </div>

                            {/* Import Export */}
                            <div className="profile-info-section npbs-card">
                              <div className="profile-info-section-header">
                                <TbPercentage25 />
                                <h6>Percentage Of Business</h6>
                              </div>

                              {hasBusinessData ? (
                                <>
                                  <div className="npbs-legend">
                                    <span>
                                      <i className="export"></i>Export
                                    </span>
                                    <span>
                                      <i className="import"></i>Import
                                    </span>
                                  </div>

                                  <div className="npbs-chart">
                                    <Doughnut
                                      data={{
                                        labels: ["Export", "Import"],
                                        datasets: [
                                          {
                                            data: [
                                              profileData?.businessStatistics
                                                ?.exportPercentage || 0,
                                              profileData?.businessStatistics
                                                ?.importPercentage || 0,
                                            ],
                                            backgroundColor: [
                                              "#f3722c",
                                              "#f9c74f",
                                            ],
                                            borderWidth: 0,
                                          },
                                        ],
                                      }}
                                      options={chartOptions}
                                    />
                                  </div>
                                </>
                              ) : (
                                <EmptyState
                                  title="No business statistics available."
                                  description="Business distribution data has not been provided yet."
                                />
                              )}
                            </div>

                            {/* Source */}
                            <div className="profile-info-section npbs-card">
                              <div className="profile-info-section-header">
                                <BiNetworkChart />
                                <h6>Source Of Business</h6>
                              </div>

                              {hasSourceData ? (
                                <>
                                  <div className="npbs-legend">
                                    <span>
                                      <i className="partner"></i>Partners
                                    </span>
                                    <span>
                                      <i className="customer"></i>Own Customers
                                    </span>
                                  </div>

                                  <div className="npbs-chart">
                                    <Doughnut
                                      data={{
                                        labels: ["Partners", "Own Customers"],
                                        datasets: [
                                          {
                                            data: [
                                              profileData?.businessStatistics
                                                ?.partnersPercentage || 0,
                                              profileData?.businessStatistics
                                                ?.ownCustomersPercentage || 0,
                                            ],
                                            backgroundColor: [
                                              "#f3722c",
                                              "#f9c74f",
                                            ],
                                            borderWidth: 0,
                                          },
                                        ],
                                      }}
                                      options={chartOptions}
                                    />
                                  </div>
                                </>
                              ) : (
                                <EmptyState
                                  title="No source information available."
                                  description="Business source information has not been provided yet."
                                />
                              )}
                            </div>
                          </div>
                          <div className="profile-info-section service-expertise-card">
                            <div className="profile-info-section-header">
                              <MdOutlineDesignServices />
                              <h6>Services and Expertise</h6>
                            </div>

                            <div className="service-expertise-columns">
                              {serviceColumns.map((column, index) => {
                                const HeaderIcon = column.headerIcon;
                                return (
                                  <div
                                    className={`service-expertise-column ${column.colorClass}`}
                                    key={index}
                                  >
                                    <div className="svc-column-header">
                                      <span className="svc-column-header-icon">
                                        <HeaderIcon />
                                      </span>
                                      <div className="svc-column-header-text">
                                        <h4 className="svc-column-title">{column.title}</h4>
                                        <p className="svc-column-subtitle">{column.subtitle}</p>
                                      </div>
                                    </div>

                                    {column.items.map((item) => {
                                      const Icon = item.icon;
                                      const active =
                                        profileData?.servicesAndExpertise?.[
                                        item.key
                                        ];

                                      return (
                                        <div
                                          key={item.key}
                                          className={`service-expertise-item ${active ? "active" : "inactive"
                                            }`}
                                        >
                                          <Icon className="service-expertise-icon" />
                                          <span>{item.label}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </Tab>
                  <Tab eventKey="reviews" title="Reviews">
                    <div className="reviews-tab-area">
                      <div className="reviews-tab-header">
                        <div className="reviews-tab-summary">
                          <span className="reviews-tab-count">
                            {userInfo.reviewCount ?? 0} Reviews
                          </span>
                          {userInfo.reviewAvg > 0 && (
                            <span className="reviews-tab-avg">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                                width="14"
                                height="14"
                                color="#f59e0b"
                              >
                                <path
                                  fill="currentColor"
                                  d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                />
                              </svg>
                              {userInfo.reviewAvg}
                            </span>
                          )}
                        </div>
                        {!isOwnProfile && (
                          <div className="write-button-box card-shadow">
                            {isUserAuthenticated() ? (
                              <button
                                className="btn write-button"
                                onClick={() => setWriteAReview(true)}
                              >
                                Write a Review
                              </button>
                            ) : (
                              <div className="auth-review-actions">
                                <button
                                  className="btn ino-button"
                                  onClick={() =>
                                    (window.location.href = "/sign-up")
                                  }
                                >
                                  Sign up to write a review
                                  <LuArrowRight />
                                </button>

                                <button
                                  className="btn write-button-member write-button-member-signin "
                                  onClick={() =>
                                    (window.location.href = "/sign-in")
                                  }
                                >
                                  Already a member?{" "}
                                  <span className="write-button-member-span">
                                    {" "}
                                    Sign in
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        {reviewList?.length > 0 ? (
                          reviewList.map((item) => (
                            <div
                              key={item.id}
                              className={`review-card mb-3 text-start${item.id === reviewId ? " review-card-highlighted" : ""}`}
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
                                      style={{
                                        objectFit: "cover",
                                        width: "100%",
                                        height: "100%",
                                      }}
                                    />
                                  ) : (
                                    <>
                                      {item.reviewerUser?.firstName?.[0]?.toUpperCase()}
                                      {item.reviewerUser?.lastName?.[0]?.toUpperCase()}
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
                                    {item.reviewerUser?.firstName}{" "}
                                    {item.reviewerUser?.lastName}
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
                                        color={
                                          star <= item.rate
                                            ? "#f59e0b"
                                            : "#d1d5db"
                                        }
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
                                    {new Date(item.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                      },
                                    )}
                                  </span>
                                  {item.reviewerUser?.id === user?.id && (
                                    <button
                                      onClick={() => handleDeleteClick(item.id)}
                                      className="review-delete-btn"
                                      title="Delete review"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
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
                                    <div
                                      key={reply.id}
                                      className="review-reply-item"
                                    >
                                      <div className="review-reply-header">
                                        <div className="review-reply-avatar">
                                          {reply.user?.imageUrl ? (
                                            <Image
                                              src={reply.user.imageUrl}
                                              alt={reply.user?.firstName ?? ""}
                                              width={28}
                                              height={28}
                                              className="rounded-circle"
                                              style={{
                                                objectFit: "cover",
                                                width: "100%",
                                                height: "100%",
                                              }}
                                            />
                                          ) : (
                                            <>
                                              {reply.user?.firstName?.[0]?.toUpperCase()}
                                              {reply.user?.lastName?.[0]?.toUpperCase()}
                                            </>
                                          )}
                                        </div>
                                        <div className="review-reply-meta">
                                          <span className="review-reply-author">
                                            {reply.user?.firstName}{" "}
                                            {reply.user?.lastName}
                                          </span>
                                          <span className="review-reply-date">
                                            {formatDate(reply.createdDate)}
                                          </span>
                                        </div>
                                        {reply.user?.id === user?.id && (
                                          <button
                                            onClick={() =>
                                              deleteReply(reply.id, item.id)
                                            }
                                            className="review-delete-btn ms-auto"
                                            title="Delete reply"
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
                                              <polyline points="3 6 5 6 21 6" />
                                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                              <path d="M10 11v6" />
                                              <path d="M14 11v6" />
                                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                            </svg>
                                          </button>
                                        )}
                                      </div>
                                      <p className="review-reply-comment">
                                        {reply.comment}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {(isOwnProfile ||
                                item.reviewerUser?.id === user?.id) &&
                                (replyingTo === item.id ? (
                                  <form
                                    className="review-reply-form"
                                    onSubmit={(e) => submitReply(e, item.id)}
                                  >
                                    <textarea
                                      className="review-textarea review-reply-textarea"
                                      placeholder="Write your reply..."
                                      value={replyComment}
                                      onChange={(e) =>
                                        setReplyComment(
                                          e.target.value.slice(0, 500),
                                        )
                                      }
                                      rows={2}
                                      maxLength={500}
                                      required
                                      autoFocus
                                    />
                                    <div className="review-reply-actions">
                                      <button
                                        type="button"
                                        className="btn review-cancel-btn"
                                        onClick={() => {
                                          setReplyingTo(null);
                                          setReplyComment("");
                                        }}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="submit"
                                        className="btn write-button-submit"
                                        disabled={
                                          replyLoading || !replyComment.trim()
                                        }
                                      >
                                        {replyLoading && (
                                          <span
                                            className="spinner-border spinner-border-sm me-1"
                                            role="status"
                                          />
                                        )}
                                        Reply
                                      </button>
                                    </div>
                                  </form>
                                ) : (
                                  <button
                                    className="review-reply-btn"
                                    onClick={() => {
                                      setReplyingTo(item.id);
                                      setReplyComment("");
                                    }}
                                  >
                                    Reply
                                  </button>
                                ))}
                            </div>
                          ))
                        ) : (
                          <div className="reviews-empty-state">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="40"
                              height="40"
                              viewBox="0 0 576 512"
                              fill="none"
                            >
                              <path
                                fill="#e5e7eb"
                                d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0z"
                              />
                            </svg>
                            <p>No reviews yet.</p>
                            <span>Be the first to share your experience!</span>
                          </div>
                        )}
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
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Loading...
                                  </>
                                ) : (
                                  "More Reviews"
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                        {!hasMoreReviews && reviewList?.length > 0 && (
                          <p className="text-muted text-center my-3">
                            No more reviews
                          </p>
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
                        <Tooltip
                          id="referral-tooltip"
                          className="referral-tooltip "
                        >
                          Awarded to members who help grow the Freight Talk
                          community through successful referrals.
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <NetworkersCreateSheduleModal
        show={scheduleModalShow}
        handleClose={() => setScheduleModalShow(false)}
        userId={userInfo.id}
      />

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
              <div
                className={`review-char-counter ${500 - comment.length <= 20 ? "review-char-counter--warning" : ""}`}
              >
                {500 - comment.length} characters remaining
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="review-modal-footer">
          <button
            className="btn review-cancel-btn"
            onClick={() => setWriteAReview(false)}
          >
            Cancel
          </button>
          <button
            className="btn write-button-submit"
            type="submit"
            form="reviewForm"
            disabled={rate === 0}
          >
            Submit Review
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Body className="review-modal-body">
          <div className="delete-modal-content">
            <div className="delete-modal-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <p className="delete-modal-text">
              Are you sure you want to delete this review?
            </p>
            <p className="delete-modal-subtext">
              This action cannot be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="review-modal-footer">
          <button
            className="btn review-cancel-btn"
            onClick={() => setShowDeleteModal(false)}
          >
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
