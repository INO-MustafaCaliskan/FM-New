"use client";
import "./account-settings.css"
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faBell,
  faSlidersH,
} from "@fortawesome/free-solid-svg-icons";
import ChangePassword from "@/components/AccountSettings/ChangePassword";
import Link from "next/link";
import { AdvancedSettings } from "@/components/AccountSettings/AdvancedSettings";
import { SlugSettings } from "@/components/AccountSettings/SlugSettings";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

export default function AccountSettings() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tab || "change-password");

  const handleChangeTab = (key) => {
    setActiveTab(key);
    let newUrl = `/account-settings?tab=${key}`;
    window.history.pushState({}, '', newUrl);
  };

  useEffect(() => {
    const handlePopState = () => {
      const newTab = new URLSearchParams(window.location.search).get("tab");
      setActiveTab(newTab || "change-password");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <>
      <div className="container p-3">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="">Homepage</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Account Settings
            </li>
          </ol>
        </nav>

        <Card className="p-3">
          <div className="row">
            <div className="col-md-6">
              <h1 id="AccountTitle">Account Settings</h1>
            </div>
          </div>

          <div className="">
            <Tabs
              activeKey={activeTab}
              onSelect={(tab) => handleChangeTab(tab)}
              defaultActiveKey={activeTab}
              mountOnEnter={true}
              unmountOnExit={false}
              id="uncontrolled-tab-example"
              className="mb-5 account-setings-tab ino-tab"
            >
              {/* Change Password */}
              <Tab
                className="account-settings-link"
                eventKey="change-password"
                title={
                  <span>
                    <FontAwesomeIcon icon={faKey} /> Change Password
                  </span>
                }
              >
                <ChangePassword />
              </Tab>

              {/* Notification Settings (eski Advanced Settings) */}
              <Tab
                className="account-settings-link"
                eventKey="notification-settings"
                title={
                  <span>
                    <FontAwesomeIcon icon={faBell} /> Notification Settings
                  </span>
                }
              >
                <AdvancedSettings />
              </Tab>

              {/* Advanced Settings — Profile URL / Slug */}
              <Tab
                className="account-settings-link"
                eventKey="advanced-settings"
                title={
                  <span>
                    <FontAwesomeIcon icon={faSlidersH} /> Advanced Settings
                  </span>
                }
              >
                <SlugSettings />
              </Tab>
            </Tabs>
          </div>
        </Card>
      </div>
    </>
  );
}
