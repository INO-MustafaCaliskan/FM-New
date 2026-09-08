"use client";
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import Image from "next/image";
import "./header.css";
import { NotificationDropdown } from "../NotificationBar/NotificationDropdown";
import AnnouncementBar from "@/components/AnnouncementBar/AnnouncementBar";
import useIsMobile from "@/utils/hooks/useIsMobile";
import MembershipAnnouncement from "@/components/AnnouncementBar/MembershipAnnouncement";
import MeetingAnnouncement from "@/components/AnnouncementBar/MeetingAnnouncement";
import MobileUserMenu from "@/components/Header/MobileUserMenu";
import UserMenu from "@/components/Header/UserMenu";
import Link from "next/link";


const UserHeader = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <header>
        <AnnouncementBar />
        <MembershipAnnouncement />
        <MeetingAnnouncement />
        <Container className="header-container">
          <Navbar expand="lg">
            <Navbar.Brand>
              <Link href="/">
                <Image
                  src="/images/freight-talk-logo.jpg"
                  alt="Freight Talk"
                  width={200}
                  height={60}
                  priority
                />
              </Link>
            </Navbar.Brand>

            {isMobile && (
              <div className="d-flex gap-4">
                <div className="notification-display-mobile">
                  <NotificationDropdown />
                </div>
                <Navbar.Toggle aria-controls="navbarSupportedContent" />
              </div>
            )}

            <Navbar.Collapse
              id="navbarSupportedContent"
              className="justify-content-end"
            >
              <Nav className="header-nav-items mb-2 mb-lg-0">
                {isMobile ? (
                  <MobileUserMenu />
                ) : (
                  <UserMenu />
                )}

                {!isMobile && (
                  <div className="notification-display-web">
                    <NotificationDropdown />
                  </div>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </header>
    </>
  );
};

export default UserHeader;
