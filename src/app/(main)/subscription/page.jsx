"use client";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import { PaymentInformationTab } from "@/components/Subscription/PaymentInformationTab";
import { PlanTab } from "@/components/Subscription/PlanTab";
import { TransactionsTab } from "@/components/Subscription/TransactionsTab";
import React from "react";
import { Card, Container, Tab, Tabs } from "react-bootstrap";
import { useSearchParams } from "next/navigation";
import "./Subscription.css";

export default function Subscription() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("activeTab") || "1"; // Default to "1" (Plan tab)

  return (
    <Container>
      <InoBreadcrumb linkName="Subscription" />
      <Card>
        <Card.Body>
          <Card.Title className="mt-2">
            <h3 className="fw-bold">Subscription</h3>
          </Card.Title>
          <Tabs
            defaultActiveKey={activeTab}
            className="ino-tab mt-3"
            mountOnEnter={true}
            unmountOnExit={false}
          >
            <Tab className="pt-3" eventKey="1" title="Plan">
              <PlanTab />
            </Tab>
            <Tab className="pt-3" eventKey="2" title="Billing Information">
              <PaymentInformationTab />
            </Tab>
            <Tab className="pt-3" eventKey="3" title="Transaction History">
              <TransactionsTab />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
}
