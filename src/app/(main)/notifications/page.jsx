"use client";
import React, { useEffect, useState } from "react";
import client from "@/utils/client";
import InoPagination from "@/components/UI/InoPagination";
import useFormatDate from "@/utils/hooks/useFormatDate";
import "./notifications.css";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { Card, Container, Toast } from "react-bootstrap";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import Image from "next/image";
import { BiCommentDetail, BiTrash } from "react-icons/bi";
import ProfileSidebar from "@/components/ProfileSidebar/ProfileSidebar";
import { useUser } from "@/context/UserContext";

const fetchNotifications = async (currentPage = 1, pageSize = 15) => {
  const response = await client.get(
    `/UserNotification/GetAllForLoginUser?pageNumber=${currentPage}&pageSize=${pageSize}`,
  );

  if (response.status !== 200) {
    toast.error("Error while fetching notifications");
    return null;
  }

  return response.data.data;
};

const PAGE_SIZE = 15;

const Notifications = () => {
  const fallbackSrc = "/images/ft-logo-square.png";
  const formatDate = useFormatDate();
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [notificationData, setNotificationData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const getNotifications = async (pg) => {
    const data = await fetchNotifications(pg, PAGE_SIZE);
    if (data != null) setNotificationData(data);

    setLoading(false);
  };

  useEffect(() => {
    getNotifications(page);
  }, [page]);

  const handleFallbackImage = (index) => {
    setNotificationData((prevData) => {
      const updatedListItems = [...prevData.listItems];
      updatedListItems[index] = {
        ...updatedListItems[index],
        imageUrl: fallbackSrc,
      };
      return { ...prevData, listItems: updatedListItems };
    });
  };

  const handleClickRemove = async (notificationId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to remove this notification?",
    );
    if (isConfirmed) {
      try {
        await client.get(
          `/UserNotification/DeleteByIdForLoginUser/${notificationId}`,
        );
        setNotificationData((prevData) => {
          const updatedListItems = prevData.listItems.filter(
            (item) => item.notificationId !== notificationId,
          );
          return { ...prevData, listItems: updatedListItems };
        });
        toast.success("Notification removed.");
      } catch (error) {
        toast.error("Error while removing notification");
      }
    }
  };

  const handleClearAll = async () => {
    const isConfirmed = window.confirm("Are you sure you want to clear all notifications?");
    
    if (isConfirmed) {
      try {
        await client.get(`/UserNotification/DeleteAllForLoginUser`);
        setNotificationData((prevData) => {
          return { ...prevData, listItems: [] };
        });
        toast.success("All notifications cleared.");
      }catch (error) {
        toast.error("Error while clearing notifications");
      }
    }
  };

  return (
    <Container>
      <InoBreadcrumb linkName="Notifications" />
      <div className="d-flex row flex-wrap justify-content-between">
        <div className="col-lg-3 col-sm-12 ps-0">
          <ProfileSidebar
            userInfo={user}
            ownProfileActionLabel="Preview My Profile"
            ownProfileActionHref={`/user-profile/${user?.slug}`}
          />
        </div>
        <div className="col-lg-9 col-sm-12 ps-0 pe-0">
      <Card className="mt-2 mt-lg-0">
        <Card.Body>
          <div>
            {loading && (
              <div
                className="d-flex flex-row justify-content-center align-items-center"
                style={{ height: 200 }}
              >
                <CircularProgress size={24} />{" "}
              </div>
            )}
            {(!loading && (!notificationData || notificationData.listItems.length) === 0) && (
              <div className="d-flex flex-column justify-content-center align-items-center">
                <BiCommentDetail size={40} />
                <h5 className="text-muted fw-bold text-center">
                  No notifications to display.
                </h5>
              </div>
            )}
            {
                !loading && notificationData && notificationData.listItems.length > 0 && (
                    <div className="mb-4 d-flex flex-row justify-content-between align-items-center"> 
                        <span className="h4">Notifications</span>
                        <btn className="btn btn-sm btn-outline-danger" onClick={handleClearAll}>Clear All</btn>
                    </div>
                )
            }
            {notificationData?.listItems.map((notification, index) => {
              return (
                <div
                  key={index}
                  className="d-flex flex-row align-items-center mb-3 border-bottom pb-3"
                >
                  <Image
                    alt="notification image"
                    className="image-fluid rounded-circle me-3 border"
                    height={40}
                    width={40}
                    src={notification.imageUrl || fallbackSrc}
                    onError={() => handleFallbackImage(index)}
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      {notification.redirectUrl ? (
                        <a href={notification.redirectUrl} className="mb-1">
                          {notification.description}
                        </a>
                      ) : (
                        <p className="mb-1">{notification.description}</p>
                      )}
                      <button
                        onClick={() =>
                          handleClickRemove(notification.notificationId)
                        }
                      >
                        <BiTrash color="red" size={20} />
                      </button>
                    </div>
                    <small className="text-muted">
                      {formatDate(notification.sendDate, true)}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
          
            {notificationData && notificationData.listItems.length > 0 && (
                <div className="d-flex justify-content-center mt-5">
                    <InoPagination
                        currentPage={notificationData.currentPage}
                        onPageChange={handlePageChange}
                        totalPage={notificationData.totalPage}
                    />
              </div>
            )}
        </Card.Body>
      </Card>
        </div>
      </div>
    </Container>
  );
};

export default Notifications;
