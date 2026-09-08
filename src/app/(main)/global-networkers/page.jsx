"use client";

import NetworkersTab from "@/components/GlobalNetworkers/NetworkersTab";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import { faCircleCheck, faStar, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Cookies from 'js-cookie';
import './networkers.css'
import NetworkerActionButtons from "@/components/GlobalNetworkers/NetworkerActionButtons";


const NetworkersPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="container">
      <InoBreadcrumb linkName="Global Networkers" />

      <Card className="p-3 global-networkers-card">

        {isAuthenticated ? (
          <>
            <NetworkerActionButtons />
            <Tabs
              mountOnEnter={true}
              unmountOnExit={true}
              className="mb-3 tabs-with-line col-lg-5 mt-3 mt-md-0 "
              id="uncontrolled-tab-example"
              defaultActiveKey="all"
            >

              <Tab
                eventKey="all"
                title={
                  <span>
                    <FontAwesomeIcon icon={faUsers} /> All
                  </span>
                }
              >
                <NetworkersTab tabName="all" />
              </Tab>

              <Tab
                eventKey="available"
                title={
                  <span>
                    <FontAwesomeIcon icon={faCircleCheck} /> Available
                  </span>
                }
              >
                <NetworkersTab tabName="available" />
              </Tab>
              <Tab
                eventKey="favorites"
                title={
                  <span>
                    <FontAwesomeIcon icon={faStar} /> Favorites
                  </span>
                }
              >
                <NetworkersTab tabName="favorite" />
              </Tab>

            </Tabs></>
        ) : (
          <>
            <div className="networkers-welcome-section">
              <h2 className="welcome-title">Find Partners. Exchange RFQs. Win More Shipments.</h2>
              <p className="welcome-subtitle">Join a global community of freight forwarders, logistics, and supply chain professionals.</p>
              <p className="welcome-description">Connect face-to-face online, exchange RFQs, receive quotations, and develop business globally in real time.</p>
            </div>
            <NetworkersTab tabName="all" />
          </>
        )}


      </Card>
    </div>
  );
};


export default NetworkersPage;