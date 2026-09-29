"use client";
import React from "react";
import styles from "./UserDashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, faGlobe, faAddressBook, faAward, faTachometerAlt, faCalendarAlt, 
  faMoneyBillWave, faFileInvoiceDollar, faArrowUp, faMapMarkedAlt,
  faEye, faEllipsisV
} from "@fortawesome/free-solid-svg-icons";

export default function UserDashboard() {
  return (
    <div className={styles.dashboardContainer}>
      
      {/* Top Stats Grid */}
      <div className={styles.statsGrid}>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIconWrapper} ${styles.iconBlue}`}>
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statTitle}>Total Members</span>
            <span className={styles.statValue}>324</span>
            <span className={styles.statChange}>
              <span className={styles.changeUp}><FontAwesomeIcon icon={faArrowUp} /> 10%</span> vs last 30 days
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconWrapper} ${styles.iconGreen}`}>
            <FontAwesomeIcon icon={faGlobe} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statTitle}>Countries</span>
            <span className={styles.statValue}>78</span>
            <span className={styles.statChange}>
              <span className={styles.changeUp}><FontAwesomeIcon icon={faArrowUp} /> 8%</span>  <span> vs last 30 days</span>
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconWrapper} ${styles.iconPurple}`}>
            <FontAwesomeIcon icon={faAddressBook} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statTitle}>Contacts</span>
            <span className={styles.statValue}>684</span>
            <span className={styles.statChange}>
              <span className={styles.changeUp}><FontAwesomeIcon icon={faArrowUp} /> 12%</span> vs last 30 days
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconWrapper} ${styles.iconOrange}`}>
            <FontAwesomeIcon icon={faAward} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statTitle}>Reward Points</span>
            <span className={styles.statValue}>1,850</span>
            <span className={styles.statChange}>
              <span className={styles.changeUp}><FontAwesomeIcon icon={faArrowUp} /> 18%</span> vs last 30 days
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconWrapper} ${styles.iconBlue}`}>
            <FontAwesomeIcon icon={faTachometerAlt} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statTitle}>Performance Score</span>
            <span className={styles.statValue}>87 / 100</span>
            <span className={styles.statChange}>
              <span className={styles.changeUp}><FontAwesomeIcon icon={faArrowUp} /> 6 pts</span> vs last 30 days
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconWrapper} ${styles.iconBlue}`}>
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statTitle}>Member Since</span>
            <span className={styles.statValue}>Jul 19, 2023</span>
            <span className={styles.changeNeutral}>
              1 year, 11 months<br/>Member ID: FM-28457
            </span>
          </div>
        </div>

      </div>

      {/* Main Bottom Grid */}
      <div className={styles.mainGrid}>
        
        {/* Column 1: Payment Overview */}
        <div className={styles.widgetCard}>
          <div className={styles.widgetHeader}>
            <span className={styles.widgetTitle}>
              <FontAwesomeIcon icon={faMoneyBillWave} style={{color: "#3182ce"}} /> Payment Overview
            </span>
            <select className={styles.widgetSelect}>
              <option>USD - United States dollar</option>
            </select>
          </div>
          <div className={styles.widgetBody}>
            <div className={styles.balanceArea}>
              <div className={styles.balanceIcon}><FontAwesomeIcon icon={faMoneyBillWave} /></div>
              <div className={styles.balanceLabel}>Current Balance</div>
              <div className={styles.balanceAmount}>USD $12,450.75</div>
            </div>
            
            <div className={styles.invoiceRow}>
              <div className={styles.invoiceLeft}>
                <div className={`${styles.invoiceIcon} ${styles.iconReceivable}`}><FontAwesomeIcon icon={faFileInvoiceDollar} /></div>
                <div className={styles.invoiceInfo}>
                  <span className={styles.invoiceLabel}>Receivable Invoices</span>
                  <span className={styles.invoiceCount}>5</span>
                </div>
              </div>
              <div className={styles.invoiceAmountGreen}>USD $18,320.40</div>
            </div>

            <div className={styles.invoiceRow}>
              <div className={styles.invoiceLeft}>
                <div className={`${styles.invoiceIcon} ${styles.iconPayable}`}><FontAwesomeIcon icon={faFileInvoiceDollar} /></div>
                <div className={styles.invoiceInfo}>
                  <span className={styles.invoiceLabel}>Payable Invoices</span>
                  <span className={styles.invoiceCount}>2</span>
                </div>
              </div>
              <div className={styles.invoiceAmountRed}>USD $5,869.65</div>
            </div>

          </div>
        </div>

        {/* Column 2: Quotation & Visitors */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          
          <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}>
              <span className={styles.widgetTitle}>
                <FontAwesomeIcon icon={faFileInvoiceDollar} style={{color: "#3182ce"}} /> Quotation System
              </span>
              <select className={styles.widgetSelect}>
                <option>Select RFQ</option>
              </select>
            </div>
            <div className={styles.widgetBody}>
              <div className={styles.rfqFlex}>
                <div className={styles.rfqBox}>
                  <FontAwesomeIcon icon={faFileInvoiceDollar} className={styles.rfqIcon} />
                  <span className={styles.rfqLabel}>Sent RFQ</span>
                  <span className={styles.rfqValue}>7</span>
                </div>
                <div className={styles.rfqDivider}></div>
                <div className={styles.rfqBox}>
                  <FontAwesomeIcon icon={faFileInvoiceDollar} className={styles.rfqIcon} />
                  <span className={styles.rfqLabel}>Received RFQ</span>
                  <span className={styles.rfqValue}>3</span>
                </div>
              </div>
              <div className={styles.rfqFooter}>
                Manage and respond to RFQs from your network
              </div>
            </div>
          </div>

          <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}>
              <span className={styles.widgetTitle}>
                <FontAwesomeIcon icon={faEye} style={{color: "#3182ce"}} /> Profile Visitors
              </span>
            </div>
            <div className={styles.widgetBody}>
              <div className={styles.visitorFlex}>
                <span className={styles.visitorValue}>24</span>
                <span className={styles.visitorLabel}>Profile views in the last 30 days</span>
                <span className={styles.changeUp}><FontAwesomeIcon icon={faArrowUp} /> 20%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Column 3: Members By Region */}
        <div className={styles.widgetCard}>
          <div className={styles.widgetHeader}>
            <span className={styles.widgetTitle}>
              <FontAwesomeIcon icon={faMapMarkedAlt} style={{color: "#3182ce"}} /> Members By Region
            </span>
            <FontAwesomeIcon icon={faEllipsisV} style={{color: "#a0aec0", cursor: "pointer"}} />
          </div>
          <div className={styles.widgetBody} style={{textAlign: "center"}}>
            
            {/* Simple CSS Donut Mock */}
            <div className={styles.donutMock}></div>

            <div className={styles.legendGrid}>
              <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotBlue}`}></span> Asia: 173</div>
              <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotGreen}`}></span> Europe: 66</div>
              <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotOrange}`}></span> Americas: 51</div>
              <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotRed}`}></span> Africa: 23</div>
              <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotPurple}`}></span> Oceania: 12</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}