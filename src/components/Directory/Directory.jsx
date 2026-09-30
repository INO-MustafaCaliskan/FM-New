"use client";
import React from "react";
import styles from "./Directory.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, faGlobe, faAddressBook, faCity, faBuilding, 
  faCheckCircle, faQuoteLeft, faSearch, faEye, faChevronLeft, faChevronRight, faSort
} from "@fortawesome/free-solid-svg-icons";

const MOCK_COMPANIES = [
  { id: 1, name: "Arrow Freight Links", logo: "https://ui-avatars.com/api/?name=Arrow+Freight&background=f7fafc&color=031F4B&bold=true", country: "Saudi Arabia", countryCode: "sa", city: "Jeddah", since: "Jan 2012", level: "Premium" },
  { id: 2, name: "Tas Trans Shipping & Freight Forwarding", logo: "https://ui-avatars.com/api/?name=Tas+Trans&background=f7fafc&color=031F4B&bold=true", country: "Greece", countryCode: "gr", city: "Athens", since: "Aug 2008", level: "Regular" },
  { id: 3, name: "JN Freight Forwarders Pvt Ltd", logo: "https://ui-avatars.com/api/?name=JN+Freight&background=f7fafc&color=031F4B&bold=true", country: "India", countryCode: "in", city: "Kochi", since: "Mar 2006", level: "Basic" },
  { id: 4, name: "Dana Kuwait Shipping & Forwarding Co. W.L.L.", logo: "https://ui-avatars.com/api/?name=Dana+Kuwait&background=f7fafc&color=031F4B&bold=true", country: "Kuwait", countryCode: "kw", city: "Kuwait City", since: "Jul 2010", level: "Regular" },
  { id: 5, name: "The Logistical Solutions Co. Pte Ltd", logo: "https://ui-avatars.com/api/?name=The+Logistical&background=f7fafc&color=031F4B&bold=true", country: "Singapore", countryCode: "sg", city: "Bedok", since: "May 2015", level: "Premium" },
  { id: 6, name: "Conveyor Logistics Ltd.", logo: "https://ui-avatars.com/api/?name=Conveyor+Logistics&background=f7fafc&color=031F4B&bold=true", country: "Bangladesh", countryCode: "bd", city: "Dhaka", since: "Jun 2011", level: "Regular" },
  { id: 7, name: "Ajay Logistics Pvt. Ltd.", logo: "https://ui-avatars.com/api/?name=Ajay+Logistics&background=f7fafc&color=031F4B&bold=true", country: "India", countryCode: "in", city: "Mumbai", since: "Feb 2009", level: "Basic" },
  { id: 8, name: "Aktar Global Freight", logo: "https://ui-avatars.com/api/?name=Aktar+Global&background=f7fafc&color=031F4B&bold=true", country: "Turkey", countryCode: "tr", city: "Istanbul", since: "Apr 2013", level: "Premium" },
  { id: 9, name: "Alm Shipping Solutions", logo: "https://ui-avatars.com/api/?name=Alm+Shipping&background=f7fafc&color=031F4B&bold=true", country: "United Arab Emirates", countryCode: "ae", city: "Dubai", since: "Sep 2014", level: "Basic" },
  { id: 10, name: "Ocean Link Forwarders", logo: "https://ui-avatars.com/api/?name=Ocean+Link&background=f7fafc&color=031F4B&bold=true", country: "Netherlands", countryCode: "nl", city: "Rotterdam", since: "Jan 2016", level: "Regular" }
];

export default function Directory() {
  return (
    <div className={styles.directoryContainer}>
      
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        Homepage / <span>Members</span>
      </div>

      {/* Top Stats */}
      <div className={styles.topStats}>
        <div className={styles.statCard}>
          <div className={styles.statIconBox}>
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Members</span>
            <span className={styles.statValue}>280+</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIconBox}>
            <FontAwesomeIcon icon={faGlobe} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Countries</span>
            <span className={styles.statValue}>75+</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconBox}>
            <FontAwesomeIcon icon={faAddressBook} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Contacts</span>
            <span className={styles.statValue}>9,500+</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconBox}>
            <FontAwesomeIcon icon={faCity} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Cities</span>
            <span className={styles.statValue}>180+</span>
          </div>
        </div>
      </div>

      {/* Tab Menu & Filter Area */}
      <div>
        <div className={styles.tabBar}>
          <div className={`${styles.tab} ${styles.tabActive}`}>
            <FontAwesomeIcon icon={faBuilding} className={styles.tabIcon} /> Companies
          </div>
          <div className={styles.tab}>
            <FontAwesomeIcon icon={faUsers} className={styles.tabIcon} /> Users
          </div>
          <div className={styles.tab}>
            <FontAwesomeIcon icon={faCheckCircle} className={styles.tabIcon} /> Available
          </div>
          <button className={styles.quoteBtn}>
            <FontAwesomeIcon icon={faQuoteLeft} /> GET QUOTE
          </button>
        </div>

        <div className={styles.filterArea}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Search by Country</span>
            <select className={styles.filterSelect}>
              <option>Select Country</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Search by Level</span>
            <select className={styles.filterSelect}>
              <option>Select Level</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Search Term</span>
            <div className={styles.filterInputWrapper}>
              <input type="text" className={styles.filterInput} placeholder="Enter Company Name or Service" />
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            </div>
          </div>

          <button className={styles.btnSearch}>Search</button>
          <button className={styles.btnClear}>Clear</button>
        </div>

        {/* Table Area */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Company</th>
                <th>Country</th>
                <th>City</th>
                <th>Member Since <FontAwesomeIcon icon={faSort} /></th>
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_COMPANIES.map(company => (
                <tr key={company.id}>
                  <td>
                    <div className={styles.companyCol}>
                      <img src={company.logo} alt={company.name} className={styles.companyLogo} />
                      <span>{company.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.countryCol}>
                      <img src={`https://flagcdn.com/w40/${company.countryCode}.png`} alt={company.country} className={styles.flagIcon} />
                      <span>{company.country}</span>
                    </div>
                  </td>
                  <td>{company.city}</td>
                  <td>{company.since}</td>
                  <td>
                    <span className={company.level === 'Basic' ? styles.badgeBasic : company.level === 'Premium' ? styles.badgePremium : styles.badgeRegular}>
                      {company.level}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionsCol}>
                      <button className={styles.actionBtn}>
                        <FontAwesomeIcon icon={faEye} /> View Company
                      </button>
                      <button className={styles.actionBtn}>
                        <FontAwesomeIcon icon={faUsers} /> Users
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.paginationArea}>
            <div className={styles.pageInfo}>Showing 1 to 10 of 126 companies</div>
            <div className={styles.pageNumbers}>
              <button className={styles.pageBtn}><FontAwesomeIcon icon={faChevronLeft} /></button>
              <button className={`${styles.pageBtn} ${styles.pageActive}`}>1</button>
              <button className={styles.pageBtn}>2</button>
              <button className={styles.pageBtn}>3</button>
              <button className={styles.pageBtn}>4</button>
              <button className={styles.pageBtn}>5</button>
              <button className={styles.pageBtn} style={{border: 'none'}}>...</button>
              <button className={styles.pageBtn}>13</button>
              <button className={styles.pageBtn}><FontAwesomeIcon icon={faChevronRight} /></button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}