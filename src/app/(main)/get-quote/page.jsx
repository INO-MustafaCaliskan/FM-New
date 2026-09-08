"use client";

import { useSearchParams, useRouter } from "next/navigation";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import QuoteWizard from "@/components/Quotation/QuoteWizard";
import { Card } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./get-quote.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import SendQuotations  from "@/components/Quotation/SendQuotations/SendQuotations";
import ReceivedQuotations from "@/components/Quotation/RecievedQuotations/RecievedQuotations";

export default function GetQuotePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = searchParams.get("tab") || "new";

  const changeTab = (tab) => {
    router.push(`/get-quote?tab=${tab}`);
  };

  return (
    <div className="container">
      <InoBreadcrumb linkName="Get Quote" />
      <Card className=" get-quote-card">
        <Tabs
          activeKey={activeTab}
          onSelect={(key) => changeTab(key)}
          mountOnEnter
          unmountOnExit
          className="mb-4 tabs-with-line col-lg-5 mt-3 mt-md-0"
          id="get-quote-tabs"
        >
          <Tab eventKey="new" title="+ New">
            <div className="quote-info-cards">
              <div className="quote-info-card">
                <h6>Who receives my rate request?</h6>
                <p>
                  Rate requests are sent to all users on the platform located in
                  the departure and arrival countries of your shipment. The
                  recipients of your requests are freight forwarders, 3PL
                  providers, and logistics service providers.
                </p>
              </div>

              <div className="quote-info-card">
                <h6>How long does it take to receive a Freight quote?</h6>
                <p>
                  Once our members receive your request, they will contact you
                  directly to provide a quotation. Timing depends on their time
                  zone and office opening hours.
                </p>
              </div>

              <div className="quote-info-card">
                <h6>
                  Once I am happy with a quote, how do I stop receiving more?
                </h6>
                <p>
                  Log in to Freight Talk, visit Get Quote &gt; Sent, then change
                  the RFQ status from Open to Closed.
                </p>
              </div>
            </div>

            <QuoteWizard />
          </Tab>

          <Tab
            eventKey="sent"
            title={
              <span>
                <FontAwesomeIcon icon={faCircleCheck} /> Sent
              </span>
            }
          >
           <SendQuotations />
         
          </Tab>

          <Tab
            eventKey="received"
            title={
              <span>
                <FontAwesomeIcon icon={faStar} /> Received
              </span>
            }
          >
            <ReceivedQuotations/>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
}
