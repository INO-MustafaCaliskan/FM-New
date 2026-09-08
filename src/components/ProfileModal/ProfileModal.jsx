import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Image from "next/image";
import client from "@/utils/client";
import moment from 'moment-timezone';
import './profile-modal.css'
import TimeZoneDisplay from "../UI/TimeZoneDisplay";


export default function ProfileModal({ show, handleClose, userId }) {
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get(
          `/User/GetOnlineNetworkerDetailById/${userId}`
        );
        const responseData = response.data.data;
        setUserInfo(responseData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    show && fetchData();
  }, [userId, show]); // Include userId in dependencies array if it can change


  const setStatusClassName = (status) => {
    switch (status) {
      case 1: // Available
        return "available";
      case 2: // Away
        return "away";
      case 3: // InAMeeting
        return "busy";
      default: // Offline
        return "offline";
    }
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>

      <Modal.Header closeButton className="d-flex flex-row align-items-start justify-content-between">
          <Modal.Title >
            <div className="d-flex  flex-column text-start " style={{paddingRight:10}}>
              <div>
                {userInfo?.firstName} {userInfo?.lastName}
              </div>
              <div className="mt-2" >
                <p className="mb-0 " style={{ fontSize: 14 }}>
                  Registration: {formatDate(userInfo.registrationDate)}
                </p>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
   
        <Modal.Body>
          <Tabs
            defaultActiveKey="MyProfile"
            id="uncontrolled-tab-example"
            className="mb-2 tabs-with-full-line"
          >
            <Tab
              className="account-settings-link  user-profile-tab"
              eventKey="MyProfile"
              title={<span> Profile</span>}
            >
              <div className="profile-area">
                <div className="meeting-tab-content">
                  <div className="meeting-tab active" id="profile">
                    <div className="col-md-12 mb-3 card-profile">
                      <div className="card ft-profile-card  t align-items-stretch networkers-card-info">
                        <div className="card-header border-0">
                          <div className="row">
                            <div className="col-8 text-start d-flex flex-column">
                              <b>Category</b>
                              {userInfo?.categoryName}
                            </div>
                            <div className="col-4 text-end d-flex flex-column">
                              <b>FTalk ID</b>
                              {userInfo?.fTalkId}
                            </div>
                          </div>
                        </div>
                        <div className="card-body text-start">
                          <div className="row">
                            <div className="col-auto">
                              <div className="ft-profile-image" title="">
                               
                                <i className={setStatusClassName(userInfo.onlineStatus)}></i>
                                <Image
                                  src={userInfo.imageUrl ? userInfo.imageUrl : "/images/empty-image.png"}
                                  alt={userInfo.firstName || "profile-first-name"}
                                  className="img-fluid"
                                  width={50}
                                  height={50}
                                />
                              </div>
                            </div>
                            <div className="col d-flex flex-column position-static p-0 ">
                              <strong className="meeting-user-fullname">
                                {userInfo.firstName} {userInfo.lastName}
                              </strong>
                              <p className="mb-0 mt-2">
                                {userInfo.companyName}
                              </p>
                              <p className="mb-0 mt-2">
                                <b>{userInfo.jobTitleName}</b>
                              </p>
                              <p className="mb-0 mt-2">
                              {userInfo.cityName ? `${userInfo.cityName}, ` : ''} 
                              {userInfo.countryName}
                              </p>
                              <div className="d-flex justify-content-between mt-3">
                                <span className="ft-meeting-count">
                                  <b>{userInfo.meetingCount}</b> Meetings
                                </span>
                                <span className="ft-meeting-count">
                                  <TimeZoneDisplay className="ft-meeting-count" timeZone={userInfo.timeZone} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 profile-detail-wrapper">
                      <h3 className="meeting-detail-head">
                        <b>My Biography</b>
                      </h3>
                      <p className="meeting-detail-comment">
                        {userInfo.biography}
                      </p>
                    </div>
                    <div className="mb-4 profile-detail-wrapper d-flex ">
                      <div className="company-logo-area ">
                        <div>
                          <Image
                            id="img_profile_photo_accsettings"
                            src={userInfo.companyImageUrl ? userInfo.companyImageUrl : "/images/no-photo.png"}
                            alt="profile-account-settings"
                            width={100}
                            height={100}
                            style={{objectFit:"contain"}}
                          />
                        </div>
                        <div className="shuddle-company-name ">{userInfo.companyName}</div>
                      </div>
                    </div>
                    <div className="mb-4  profile-detail-wrapper">
                      <h3 className="meeting-detail-head">
                        <b>Company Introduction</b>
                      </h3>
                      <p className="meeting-detail-comment mb-4">
                        {userInfo.companyIntroduction}
                      </p>
                      <span>{userInfo.companyWebsite}</span> 
                    </div>
                  </div>

                  <div className="meeting-tab" id="reviews">
                    <div id="reviewsContent"></div>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab
              className="account-settings-link"
              eventKey="Reviews"
              title={<span> Reviews</span>}
            >
              <div className="p-5 text-center">
              <p>Coming Soon !</p>
              </div>
       
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
