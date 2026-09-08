"use client";

import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Cookies from 'js-cookie';
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import ProfileSidebar from "@/components/ProfileSidebar/ProfileSidebar";
import { useUser } from "@/context/UserContext";
import MyNetworksList from "@/components/MyNetworks/MyNetworksList";
import GrowYourNetwork from "@/components/MyNetworks/GrowYourNetwork";
import NetworkStats from "@/components/MyNetworks/NetworkStats";
import NetworkNavTabs from "@/components/MyNetworks/NetworkNavTabs";
import BlueBadgeJourney from "@/components/MyNetworks/BlueBadgeJourney";
import OrangeBadgeJourney from "@/components/MyNetworks/OrangeBadgeJourney";
import SuggestedActions from "@/components/MyNetworks/SuggestedActions";
import NeedMoreCoverage from "@/components/MyNetworks/NeedMoreCoverage";
import RecentNetworkGrowth from "@/components/MyNetworks/RecentNetworkGrowth";

const MyNetworksPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Container>
      <InoBreadcrumb linkName="My Networks" />
      <div className="d-flex row flex-wrap justify-content-between">
        <div className="col-xl-3 col-12 ps-0">
          <div className="d-flex flex-column gap-3" style={{ position: 'sticky', top: '16px' }}>
            <ProfileSidebar
              userInfo={user}
              ownProfileActionLabel="Preview My Profile"
              ownProfileActionHref={`/user-profile/${user?.slug}`}
              style={{ position: 'relative', top: 'auto' }}
            />
            {/* <BlueBadgeJourney />
            <OrangeBadgeJourney />
            <SuggestedActions />
            <NeedMoreCoverage />
            <RecentNetworkGrowth /> */}
          </div>
        </div>
        <div className="col-xl-9 col-12 ps-0 pe-0 mt-4 mt-xl-0">
          {isAuthenticated ? (
            <>
              <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                <div>
                  <h4 className="fw-bold text-dark mb-1 fs-5">My Network</h4>
                  <p className="text-secondary mb-0 small">Manage your freight connections, expand your reach, and invite more partners.</p>
                </div>
                <NetworkNavTabs />
              </div>
              <NetworkStats />
              <GrowYourNetwork />
              <MyNetworksList />
            </>
          ) : (
            <div className="text-center py-5 bg-white rounded border">
              <h4>Please sign in to view your networks.</h4>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default MyNetworksPage;
