"use client";
import React, { useState } from "react";
import styles from "./CompanyProfile.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBuilding, faMapMarkerAlt, faEnvelope, faPhoneAlt, faGlobe, faUsers, 
  faCheckCircle, faShip, faPlane, faTruck, faInfoCircle, faChartPie, faStar,
  faCogs, faBoxes, faRoute, faGlobeAmericas, faHandshake, faTags
} from "@fortawesome/free-solid-svg-icons";

// React ChartJS 2
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

// React SVG Worldmap
import { WorldMap } from "react-svg-worldmap";

// Register ChartJS
ChartJS.register(ArcElement, ChartTooltip, Legend, ChartDataLabels);

export default function CompanyProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#374151",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        callbacks: {
          label(context) {
            return ` ${context.label}: ${context.parsed}%`;
          },
        },
      },
      datalabels: {
        color: "#ffffff",
        font: { size: 14, weight: "bold" },
        formatter: (value, context) => {
          if (value === 0) return "";
          return value + "%";
        }
      },
    },
  };

  // Mock Data for Charts
  const transportData = {
    labels: ["Sea Freight", "Air Freight", "Road Freight", "Rail Freight"],
    datasets: [{
      data: [50, 30, 15, 5],
      backgroundColor: ["#3182ce", "#38a169", "#dd6b20", "#805ad5"],
      borderWidth: 0,
    }]
  };
  
  const sourceData = {
    labels: ["Partners", "Own Customers"],
    datasets: [{
      data: [65, 35],
      backgroundColor: ["#e53e3e", "#319795"],
      borderWidth: 0,
    }]
  };

  const directionData = {
    labels: ["Import", "Export"],
    datasets: [{
      data: [60, 40],
      backgroundColor: ["#d69e2e", "#2b6cb0"],
      borderWidth: 0,
    }]
  };

  // Mock Data for World Map (Global Coverage)
  const mapData = [
    { country: "sa", value: 1 },
    { country: "cn", value: 1 },
    { country: "ae", value: 1 },
    { country: "tr", value: 1 },
    { country: "in", value: 1 },
    { country: "us", value: 1 }
  ];

  return (
    <div className={styles.container}>
      
      <div className={styles.breadcrumb}>
        Homepage / Members / <span>Arrow Freight Links</span>
      </div>

      <div className={styles.layoutGrid}>
        
        {/* HEADER CARD (Moved from Sidebar) */}
        <div className={styles.headerCard}>
          <div className={styles.logoBox}>
            <div style={{ color: '#031F4B', fontWeight: 900, fontSize: '28px', textAlign: 'center', lineHeight: '1.1' }}>
              <span style={{ color: '#e53e3e' }}>A</span><br/>ARROW<br/><span style={{ fontSize: '12px', color: '#3182ce' }}>FREIGHT</span>
            </div>
          </div>
          
          <div className={styles.headerInfo}>
            <div className={styles.companyNameRow}>
              <h1 className={styles.companyName}>Arrow Freight Links</h1>
              <span className={styles.companyBadge}>Premium Member</span>
            </div>
            
            <div className={styles.contactGrid}>
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>Jeddah, Saudi Arabia</span>
              </div>
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faEnvelope} />
                <span>info@arrowfreight.com</span>
              </div>
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faPhoneAlt} />
                <span>+966 12 345 6789</span>
              </div>
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faGlobe} />
                <Link href="#" style={{ color: '#3182ce', textDecoration: 'none' }}>www.arrowfreight.com</Link>
              </div>
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faUsers} />
                <span>25-50 Employees</span>
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <Link href="/company-users" style={{ textDecoration: 'none' }}>
              <button className={styles.btnPrimary}>
                <FontAwesomeIcon icon={faUsers} /> View All Users
              </button>
            </Link>
          </div>
        </div>

        {/* TABS */}
        <div className={styles.tabsArea}>
          <div 
            className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'reviews' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews (12)
          </div>
        </div>

        {/* PROFILE TAB CONTENT */}
        {activeTab === 'profile' && (
          <>
            {/* Biography */}
            {/* <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={faInfoCircle} /> My Biography
              </div>
              <div className={styles.cardBodyText}>
                <p>
                  As the founding member of Arrow Freight Links, I have dedicated my career to building a robust and reliable logistics network across the Middle East. With over 15 years of hands-on experience in global supply chain management, my primary focus has always been to deliver exceptional value to our partners through transparency and efficiency.
                </p>
                <br/>
                <p>
                  I am eager to connect with like-minded logistics professionals and agencies worldwide to foster mutually beneficial relationships and expand our service horizons.
                </p>
              </div>
            </div> */}

            {/* Company Introduction */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={faBuilding} /> Company Introduction
              </div>
              <div className={styles.cardBodyText}>
                <p>
                  Arrow Freight Links is a premier logistics and freight forwarding company based in Saudi Arabia, offering a comprehensive suite of supply chain solutions. With over a decade of experience, we specialize in air freight, ocean freight, road transportation, and customs clearance services.
                </p>
                <br/>
                <p>
                  Our mission is to provide fast, secure, and cost-effective logistics services tailored to our clients' unique needs. We boast a robust network of global partners, ensuring seamless door-to-door delivery across continents.
                </p>
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={faChartPie} /> Key Performance Indicators
              </div>
              <div className={styles.chartsRow}>
                <div className={styles.chartBox}>
                  <div className={styles.chartTitle}>Transport Modes</div>
                  <div className={styles.chartContainer}>
                    <Doughnut data={transportData} options={chartOptions} />
                  </div>
                </div>
                <div className={styles.chartBox}>
                  <div className={styles.chartTitle}>Freight Source</div>
                  <div className={styles.chartContainer}>
                    <Doughnut data={sourceData} options={chartOptions} />
                  </div>
                </div>
                <div className={styles.chartBox}>
                  <div className={styles.chartTitle}>Business Direction</div>
                  <div className={styles.chartContainer}>
                    <Doughnut data={directionData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Reviews & Global Coverage Side-by-Side */}
            <div className={styles.bottomCardsRow}>
              
              {/* Top Reviews */}
              <div className={styles.card} style={{ marginBottom: 0 }}>
                <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><FontAwesomeIcon icon={faStar} style={{ color: "#3182ce" }} /> Top Reviews</div>
                  <Link href="#" style={{ fontSize: '13px', color: '#3182ce', textDecoration: 'none' }}>
                    View All Reviews &rarr;
                  </Link>
                </div>
                <div className={styles.comingSoonText}>
                  Coming soon...
                </div>
              </div>

              {/* Global Coverage */}
              <div className={styles.card} style={{ marginBottom: 0 }}>
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={faGlobeAmericas} /> Global Coverage
              </div>
              <div className={styles.globalCoverageBody}>
                
                {/* Stats on Left */}
                <div className={styles.mapStatsLeft}>
                  <div className={styles.countriesServed}>
                    <span className={styles.countriesServedNumber}>190</span>
                    <span className={styles.countriesServedLabel}>Countries Served</span>
                  </div>
                  <div className={styles.topMarketsArea}>
                    <div className={styles.topMarketsTitle}>Top 6 Markets</div>
                    <div className={styles.topMarketsTags}>
                      <div className={styles.marketTag}>
                        <img src="https://flagcdn.com/w20/cn.png" alt="China" /> China
                      </div>
                      <div className={styles.marketTag}>
                        <img src="https://flagcdn.com/w20/us.png" alt="USA" /> United States of America
                      </div>
                      <div className={styles.marketTag}>
                        <img src="https://flagcdn.com/w20/de.png" alt="Germany" /> Germany
                      </div>
                      <div className={styles.marketTag}>
                        <img src="https://flagcdn.com/w20/my.png" alt="Malaysia" /> Malaysia
                      </div>
                      <div className={styles.marketTag}>
                        <img src="https://flagcdn.com/w20/gb.png" alt="UK" /> United Kingdom
                      </div>
                      <div className={styles.marketTag}>
                        <img src="https://flagcdn.com/w20/fr.png" alt="France" /> France
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map on Right */}
                <div className={styles.mapRight}>
                  <WorldMap
                    color="#3182ce"
                    title=""
                    value-suffix="Market"
                    size="sm"
                    data={mapData}
                    backgroundColor="#f7fafc"
                  />
                </div>

              </div>
            </div>
            
            </div>

            {/* Services & Solutions */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={faCogs} /> Services & Solutions
              </div>
              <div className={styles.servicesGrid}>
                
                <div className={styles.serviceGroup}>
                  <div className={styles.serviceTitle}>
                    <FontAwesomeIcon icon={faRoute} /> Transport Modes
                  </div>
                  <div className={styles.serviceDesc}>Multiple transport options to move your cargo globally.</div>
                  <div className={styles.serviceList}>
                    <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Sea Freight</div>
                    <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Air Freight</div>
                    <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Road Freight</div>
                    <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> FCL / LCL Services</div>
                  </div>
                </div>

                <div className={styles.serviceGroup}>
                  <div className={styles.serviceTitle}>
                    <FontAwesomeIcon icon={faInfoCircle} /> Specialized Solutions
                  </div>
                  <div className={styles.serviceDesc}>Industry-focused expertise for unique cargo.</div>
                  <div className={styles.serviceList}>
                    <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Cold Chain</div>
                    <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Dangerous Goods</div>
                    <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Project Cargo / Heavy Lift</div>
                    <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Automotive Logistics</div>
                  </div>
                </div>

                <div className={styles.serviceGroup}>
                  <div className={styles.serviceTitle}>
                    <FontAwesomeIcon icon={faCogs} /> Service Types
                  </div>
                  <div className={styles.serviceDesc}>End-to-end services to streamline operations.</div>
                  <div className={styles.serviceList}>
                    <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Customs Clearance</div>
                    <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Warehousing</div>
                    <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Cross Trade</div>
                    <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Integrated Logistics</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Why People Connect With Us */}
            {/* <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={faHandshake} /> Why People Connect With Us
              </div>
              <div className={styles.tagList}>
                <div className={styles.tagItem}><FontAwesomeIcon icon={faCheckCircle} /> Reliable Overseas Partnerships</div>
                <div className={styles.tagItem}><FontAwesomeIcon icon={faCheckCircle} /> Fast & Competitive Quotations</div>
                <div className={styles.tagItem}><FontAwesomeIcon icon={faCheckCircle} /> Strong Local Market Expertise</div>
                <div className={styles.tagItem}><FontAwesomeIcon icon={faCheckCircle} /> Customs & Compliance Support</div>
              </div>
            </div> */}

            {/* What Are We Interested In */}
            {/* <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={faTags} /> What Are We Interested In
              </div>
              <div className={styles.tagList}>
                <div className={styles.tagItem}><FontAwesomeIcon icon={faCheckCircle} /> New Agency Partnerships</div>
                <div className={styles.tagItem}><FontAwesomeIcon icon={faCheckCircle} /> RFQs & Freight Quotations</div>
                <div className={styles.tagItem}><FontAwesomeIcon icon={faCheckCircle} /> Project Cargo Opportunities</div>
                <div className={styles.tagItem}><FontAwesomeIcon icon={faCheckCircle} /> Cross Trade Business</div>
              </div>
            </div> */}
          </>
        )}

        {/* REVIEWS TAB CONTENT */}
        {activeTab === 'reviews' && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FontAwesomeIcon icon={faCheckCircle} /> Reviews
            </div>
            <div className={styles.cardBodyText}>
              <p>There are no reviews for this company yet.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}