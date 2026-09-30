"use client";
import React, { Suspense } from "react";
import styles from "./Directory.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, faGlobe, faAddressBook, faCity, faBuilding, 
  faCheckCircle, faQuoteLeft, faSearch, faEye, faChevronLeft, 
  faChevronRight, faSort, faCommentDots
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const MOCK_COMPANIES = [
  { id: 1, name: "Arrow Freight Links", logo: "https://ui-avatars.com/api/?name=Arrow+Freight&background=f7fafc&color=031F4B&bold=true", country: "Saudi Arabia", countryCode: "sa", city: "Jeddah", since: "Jan 2012", level: "Premium" },
  { id: 2, name: "Tas Trans Shipping & Freight Forwarding", logo: "https://ui-avatars.com/api/?name=Tas+Trans&background=f7fafc&color=031F4B&bold=true", country: "Greece", countryCode: "gr", city: "Athens", since: "Aug 2008", level: "Regular" },
  { id: 3, name: "JN Freight Forwarders Pvt Ltd", logo: "https://ui-avatars.com/api/?name=JN+Freight&background=f7fafc&color=031F4B&bold=true", country: "India", countryCode: "in", city: "Kochi", since: "Mar 2006", level: "Basic" },
  { id: 4, name: "Dana Kuwait Shipping & Forwarding Co. W.L.L.", logo: "https://ui-avatars.com/api/?name=Dana+Kuwait&background=f7fafc&color=031F4B&bold=true", country: "Kuwait", countryCode: "kw", city: "Kuwait City", since: "Jul 2010", level: "Regular" },
  { id: 5, name: "The Logistical Solutions Co. Pte Ltd", logo: "https://ui-avatars.com/api/?name=The+Logistical&background=f7fafc&color=031F4B&bold=true", country: "Singapore", countryCode: "sg", city: "Bedok", since: "May 2015", level: "Premium" },
  { id: 6, name: "Conveyor Logistics Ltd.", logo: "https://ui-avatars.com/api/?name=Conveyor+Logistics&background=f7fafc&color=031F4B&bold=true", country: "Bangladesh", countryCode: "bd", city: "Dhaka", since: "Jun 2011", level: "Regular" },
  { id: 7, name: "Ajay Logistics Pvt. Ltd.", logo: "https://ui-avatars.com/api/?name=Ajay+Logistics&background=f7fafc&color=031F4B&bold=true", country: "India", countryCode: "in", city: "Mumbai", since: "Feb 2009", level: "Basic" },
  { id: 8, name: "Aktar Global Freight", logo: "https://ui-avatars.com/api/?name=Aktar+Global&background=f7fafc&color=031F4B&bold=true", country: "Turkey", countryCode: "tr", city: "Istanbul", since: "Apr 2013", level: "Premium" }
];

const MOCK_USERS = [
  { id: 1, name: "Ahmed Ali", title: "CEO", avatar: "https://ui-avatars.com/api/?name=Ahmed+Ali&background=ebf8ff&color=3182ce&bold=true", country: "Saudi Arabia", countryCode: "sa", city: "Jeddah", company: "Arrow Freight Links", email: "ahmed@arrowfreight.com" },
  { id: 2, name: "Maria Kostopoulos", title: "Operations Manager", avatar: "https://ui-avatars.com/api/?name=Maria+Kostopoulos&background=ebf8ff&color=3182ce&bold=true", country: "Greece", countryCode: "gr", city: "Athens", company: "Tas Trans Shipping", email: "maria@tastrans.com" },
  { id: 3, name: "Rajesh Kumar", title: "Logistics Director", avatar: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=ebf8ff&color=3182ce&bold=true", country: "India", countryCode: "in", city: "Kochi", company: "JN Freight Forwarders", email: "rajesh@jnfreight.in" },
  { id: 4, name: "Fatima Al-Sabah", title: "Managing Partner", avatar: "https://ui-avatars.com/api/?name=Fatima+Al-Sabah&background=ebf8ff&color=3182ce&bold=true", country: "Kuwait", countryCode: "kw", city: "Kuwait City", company: "Dana Kuwait Shipping", email: "fatima@danakuwait.com" },
  { id: 5, name: "David Chen", title: "Supply Chain Analyst", avatar: "https://ui-avatars.com/api/?name=David+Chen&background=ebf8ff&color=3182ce&bold=true", country: "Singapore", countryCode: "sg", city: "Bedok", company: "The Logistical Solutions", email: "david.c@logistical.sg" },
  { id: 6, name: "Hasan Rahman", title: "Branch Manager", avatar: "https://ui-avatars.com/api/?name=Hasan+Rahman&background=ebf8ff&color=3182ce&bold=true", country: "Bangladesh", countryCode: "bd", city: "Dhaka", company: "Conveyor Logistics Ltd.", email: "hasan@conveyor.bd" },
  { id: 7, name: "Priya Sharma", title: "Export Coordinator", avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=ebf8ff&color=3182ce&bold=true", country: "India", countryCode: "in", city: "Mumbai", company: "Ajay Logistics Pvt. Ltd.", email: "priya@ajaylogistics.com" },
  { id: 8, name: "Kemal YÃ„Â±lmaz", title: "Business Development", avatar: "https://ui-avatars.com/api/?name=Kemal+Yilmaz&background=ebf8ff&color=3182ce&bold=true", country: "Turkey", countryCode: "tr", city: "Istanbul", company: "Aktar Global Freight", email: "kemal@aktarglobal.com.tr" }
];

function DirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = searchParams.get('tab') || 'companies';

  const handleTabChange = (tab) => {
    router.push(`${pathname}?tab=${tab}`);
  };

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
          <div 
            className={`${styles.tab} ${activeTab === 'companies' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('companies')}
          >
            <FontAwesomeIcon icon={faBuilding} className={styles.tabIcon} /> Companies
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('users')}
          >
            <FontAwesomeIcon icon={faUsers} className={styles.tabIcon} /> Users
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'available' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('available')}
          >
            <FontAwesomeIcon icon={faCheckCircle} className={styles.tabIcon} /> Available
          </div>
          {/* <button className={styles.quoteBtn}>
            <FontAwesomeIcon icon={faQuoteLeft} /> GET QUOTE
          </button> */}
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
              <input type="text" className={styles.filterInput} placeholder={activeTab === 'users' ? "Enter User Name or Email" : "Enter Company Name or Service"} />
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
              {activeTab === 'companies' && (
                <tr>
                  <th>Company</th>
                  <th>Country</th>
                  <th>City</th>
                  <th>Member Since <FontAwesomeIcon icon={faSort} /></th>
                  <th>Level</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              )}
              {activeTab === 'users' && (
                <tr>
                  <th>User Profile</th>
                  <th>Location</th>
                  <th>Company Info</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              )}}
            </thead>
            <tbody>
              {activeTab === 'companies' && MOCK_COMPANIES.map(company => (
                <tr key={company.id}>
                  <td>
                    <div className={styles.companyCol}>
                      <img src={company.logo} alt={company.name} className={styles.companyLogo} />
                      <span className={styles.mainText}>{company.name}</span>
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
                  <td >
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

              {activeTab === 'users' && MOCK_USERS.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.companyCol}>
                      <img src={user.avatar} alt={user.name} className={styles.userAvatar} />
                      <div className={styles.stackedText}>
                        <span className={styles.mainText}>{user.name}</span>
                        <span className={styles.subText}>{user.title}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.countryCol}>
                      <img src={`https://flagcdn.com/w40/${user.countryCode}.png`} alt={user.country} className={styles.flagIcon} />
                      <div className={styles.stackedText}>
                        <span className={styles.mainText}>{user.country}</span>
                        <span className={styles.subText}>{user.city}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.stackedText}>
                      <span className={styles.mainText}>{user.company}</span>
                      <span className={styles.subText}>{user.email}</span>
                    </div>
                  </td>
                  <td >
                    <div className={styles.actionsCol}>
                      <button className={styles.actionBtn}>
                        <FontAwesomeIcon icon={faCommentDots} /> Chat
                      </button>
                      <button className={styles.actionBtn}>
                        <FontAwesomeIcon icon={faEye} /> View Profile
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {activeTab !== 'available' && (
            <div className={styles.paginationArea}>
            <div className={styles.pageInfo}>Showing 1 to 8 of {activeTab === 'companies' ? '126 companies' : '850 users'}</div>
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
          )}
        </div>
      </div>
      
    </div>
  );
}

export default function Directory() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DirectoryContent />
    </Suspense>
  );
}