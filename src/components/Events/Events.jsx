"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Events.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, faBookmark, faCalendarAlt, faClock, faVideo, faMapMarkerAlt, faChevronLeft, faChevronRight, faCog, faWallet, faCheckCircle, faLock, faStar, faBell, faInfoCircle, faCheck 
} from "@fortawesome/free-solid-svg-icons";

export default function Events() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filterTab, setFilterTab] = useState("All");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("eventsActiveTab");
      if (savedTab) setActiveTab(savedTab);
      
      const savedFilter = localStorage.getItem("registrationsFilterTab");
      if (savedFilter) setFilterTab(savedFilter);
    }
  }, []);

  const handleFilterChange = (tab) => {
    setFilterTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("registrationsFilterTab", tab);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("eventsActiveTab", tab);
    }
  };

  const MOCK_EVENTS = [
    {
      id: 1,
      type: "Virtual",
      title: "Orientation & Business Development Meeting",
      date: "Sep 08, 2026 - Sep 09, 2026",
      time: "11:00 AM - 12:00 PM (UTC+3)",
      locationType: "virtual",
      location: "Google Meet",
      desc: "Kickstart your journey with Freight Midpoint. Learn, connect, and grow with our global network.",
      imgUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80"
    },
    {
      id: 2,
      type: "Physical",
      title: "INO Summit 2026 Annual General Meeting",
      date: "Oct 13, 2026 - Oct 14, 2026",
      time: "09:00 AM - 05:00 PM (UTC+3)",
      locationType: "physical",
      location: "Istanbul Convention Center, Istanbul, Turkey",
      desc: "The premier annual gathering of INO Networks Group members to align, collaborate, and shape the future.",
      imgUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80"
    },
    {
      id: 3,
      type: "Virtual",
      title: "Freight Market Insights Webinar",
      date: "Nov 17, 2026 - Nov 18, 2026",
      time: "11:00 AM - 12:00 PM (UTC+3)",
      locationType: "virtual",
      location: "Google Meet",
      desc: "Expert analysis of global freight trends, market outlook, and opportunities for forwarders.",
      imgUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80"
    },
    {
      id: 4,
      type: "Physical",
      title: "Global Forwarders Networking Session",
      date: "Dec 15, 2026 - Dec 16, 2026",
      time: "04:00 PM - 07:00 PM (UTC+3)",
      locationType: "physical",
      location: "Pullman Hotel, Dubai, UAE",
      desc: "Connect with freight forwarders worldwide and build meaningful business relationships.",
      imgUrl: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=500&q=80"
    }
  ];

  const MOCK_PREVIOUS_EVENTS = [
    {
      id: 101,
      type: "Physical",
      title: "INO Summit 2025 Annual General Meeting",
      date: "Oct 10, 2025 - Oct 11, 2025",
      time: "09:00 AM - 05:00 PM (UTC+3)",
      locationType: "physical",
      location: "Hilton Bomonti, Istanbul, Turkey",
      desc: "Last year's successful networking event with over 500 delegates from 60 countries.",
      imgUrl: "https://images.unsplash.com/photo-1561489413-985b06da5bee?w=500&q=80"
    },
    {
      id: 102,
      type: "Virtual",
      title: "Logistics Digitalization Conference",
      date: "May 20, 2025 - May 21, 2025",
      time: "10:00 AM - 02:00 PM (UTC+3)",
      locationType: "virtual",
      location: "Zoom",
      desc: "Discussed the future of freight forwarding and digital supply chain solutions.",
      imgUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500&q=80"
    }
  ];

  const MOCK_REGISTRATIONS = [
    {
      id: 1,
      name: "FM Annual Conference 2027",
      date: "Jun 28-30, 2027",
      location: "Istanbul, Türkiye",
      delegates: 2,
      spouses: 1,
      vipTables: 1,
      sponsor: "Gold Sponsor",
      paymentStatus: "Paid",
      attendanceStatus: "Confirmed",
      isUpcoming: true
    },
    {
      id: 2,
      name: "INO Summit 2027 Annual General Meeting",
      date: "Aug 18-20, 2027",
      location: "Singapore, Singapore",
      delegates: 1,
      spouses: 0,
      vipTables: 0,
      sponsor: "Silver Sponsor",
      paymentStatus: "Unpaid",
      attendanceStatus: "Pending",
      isUpcoming: true
    },
    {
      id: 3,
      name: "FM Annual Conference 2026",
      date: "Jan 24-27, 2026",
      location: "Barcelona, Spain",
      delegates: 2,
      spouses: 1,
      vipTables: 0,
      sponsor: "Bronze Sponsor",
      paymentStatus: "Paid",
      attendanceStatus: "Attended",
      isUpcoming: false
    },
    {
      id: 4,
      name: "FM Regional Meeting 2025",
      date: "Oct 05-06, 2025",
      location: "Dubai, UAE",
      delegates: 1,
      spouses: 0,
      vipTables: 0,
      sponsor: null,
      paymentStatus: "Paid",
      attendanceStatus: "Attended",
      isUpcoming: false
    },
    {
      id: 5,
      name: "FM AGM 2024",
      date: "Mar 18-19, 2024",
      location: "Bangkok, Thailand",
      delegates: 2,
      spouses: 0,
      vipTables: 1,
      sponsor: "Silver Sponsor",
      paymentStatus: "Paid",
      attendanceStatus: "Attended",
      isUpcoming: false
    },
    {
      id: 6,
      name: "Global Forwarders Webinar",
      date: "Dec 10, 2023",
      location: "Virtual",
      delegates: 3,
      spouses: 0,
      vipTables: 0,
      sponsor: null,
      paymentStatus: "Unpaid",
      attendanceStatus: "No Show",
      isUpcoming: false
    }
  ];

  const filteredRegistrations = MOCK_REGISTRATIONS.filter(reg => {
    if (filterTab === 'Upcoming') return reg.isUpcoming;
    if (filterTab === 'Previous') return !reg.isUpcoming;
    if (filterTab === 'Paid') return reg.paymentStatus === 'Paid';
    if (filterTab === 'Unpaid') return reg.paymentStatus === 'Unpaid';
    return true; // 'All'
  });

  return (
    <div className={styles.container}>
      
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Events</h1>
        <p className={styles.pageSubtitle}>Discover upcoming network events, meetings, and registration opportunities.</p>
      </div>

      <div className={styles.tabsArea}>
        <div 
          className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('upcoming')}
        >
          Upcoming Events
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'previous' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('previous')}
        >
          Previous Events
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'registrations' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('registrations')}
        >
          My Registrations
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'scheduler' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('scheduler')}
        >
          One to One Scheduler
        </div>
      </div>
{/* 
      <div className={styles.searchArea}>
        <div className={styles.searchInputBox}>
          <input type="text" placeholder="Search events by title, keyword..." />
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
        </div>
      </div> */}

      {activeTab === 'upcoming' && (
        <div className={styles.eventsGrid}>
          {MOCK_EVENTS.map(event => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventImageCol}>
                <div className={event.type === 'Virtual' ? styles.badgeVirtual : styles.badgePhysical}>
                  {event.type}
                </div>
                <img src={event.imgUrl} alt={event.title} className={styles.eventImg} />
              </div>
              
              <div className={styles.eventContentCol}>
                <FontAwesomeIcon icon={faBookmark} className={styles.bookmarkIcon} />
                
                <h3 className={styles.eventTitle}>{event.title}</h3>
                
                <div className={styles.eventDetailsRow}>
                  <div className={styles.detailItem}>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>{event.date}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FontAwesomeIcon icon={faClock} />
                    <span>{event.time}</span>
                  </div>
                </div>
                
                <div className={styles.eventDetailsRow}>
                  <div className={styles.detailItem}>
                    <FontAwesomeIcon icon={event.locationType === 'virtual' ? faVideo : faMapMarkerAlt} />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className={styles.eventDesc}>{event.desc}</p>
                
                <div className={styles.eventActions}>
                  <Link href="/events/registration" style={{ textDecoration: "none", }}>
                    <button className={styles.btnPrimary} >Register Now</button>
                  </Link>
                  <button className={styles.btnSecondary}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'previous' && (
        <div className={styles.eventsGrid}>
          {MOCK_PREVIOUS_EVENTS.map(event => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventImageCol}>
                <div className={event.type === 'Virtual' ? styles.badgeVirtual : styles.badgePhysical}>
                  {event.type}
                </div>
                <img src={event.imgUrl} alt={event.title} className={styles.eventImg} />
              </div>
              
              <div className={styles.eventContentCol}>
                <FontAwesomeIcon icon={faBookmark} className={styles.bookmarkIcon} />
                
                <h3 className={styles.eventTitle}>{event.title}</h3>
                
                <div className={styles.eventDetailsRow}>
                  <div className={styles.detailItem}>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>{event.date}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FontAwesomeIcon icon={faClock} />
                    <span>{event.time}</span>
                  </div>
                </div>
                
                <div className={styles.eventDetailsRow}>
                  <div className={styles.detailItem}>
                    <FontAwesomeIcon icon={event.locationType === 'virtual' ? faVideo : faMapMarkerAlt} />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className={styles.eventDesc}>{event.desc}</p>
                
                <div className={styles.eventActions}>
                  <button className={styles.btnSecondary} >View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

            {activeTab === 'registrations' && (
        <div style={{ marginTop: '20px' }}>
          

          {/* Active Registrations Section */}
          <div>
            <div className={styles.sectionTitleRow}>
              <h2 className={styles.sectionTitle}>Upcoming / Active Registrations</h2>
              <span className={styles.countBadge} style={{ marginBottom: '0px' }}>
                2
              </span>
            </div>

            <div className={styles.registrationsSubtitle}>
            Manage your upcoming event registrations, participant details, invoices, and past event records in one place.
          </div>

            {/* Card 1 */}
            <div className={styles.horizontalCard}>
              <img src="https://images.unsplash.com/photo-1596395819057-e37f55a8516b?w=500&q=80" alt="Istanbul" className={styles.horizontalCardImg} />
              <div className={styles.horizontalCardContent}>
                <h3 className={styles.horizTitle}>FM Annual Conference 2027</h3>
                <div className={styles.horizMeta}>
                  <span><FontAwesomeIcon icon={faMapMarkerAlt} /> Istanbul, Türkiye</span>
                  <span style={{ color: '#cbd5e0' }}>•</span>
                  <span><FontAwesomeIcon icon={faCalendarAlt} /> Jun 28-30, 2027</span>
                </div>
                
                <div className={styles.statusGrid}>
                  <div className={styles.statusGroup}>
                    <span className={styles.statusLabel}>Registration Status</span>
                    <span className={styles.badgeGreen}>Confirmed</span>
                  </div>
                  <div className={styles.statusGroup}>
                    <span className={styles.statusLabel}>Payment Status</span>
                    <span className={styles.badgeGreen}>Paid by Credit Card</span>
                  </div>
                </div>

                <div className={styles.tagsRow}>
                  <span className={`${styles.tagPill} ${styles.tagBlue}`}>2 Delegates</span>
                  <span className={`${styles.tagPill} ${styles.tagOrange}`}>1 Spouse</span>
                  <span className={`${styles.tagPill} ${styles.tagPurple}`}>1 VIP Table</span>
                  <span className={`${styles.tagPill} ${styles.tagOrange}`}>Gold Sponsor</span>
                </div>

                <div className={styles.cardActionsRow}>
                  <button className={styles.btnOutlineBlue}>
                    <FontAwesomeIcon icon={faCog} /> Manage Registration
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className={styles.horizontalCard}>
              <img src="https://images.unsplash.com/photo-1596395819057-e37f55a8516b?w=500&q=80" alt="Singapore" className={styles.horizontalCardImg} />
              <div className={styles.horizontalCardContent}>
                <h3 className={styles.horizTitle}>INO Summit 2027 Annual General Meeting</h3>
                <div className={styles.horizMeta}>
                  <span><FontAwesomeIcon icon={faMapMarkerAlt} /> Singapore, Singapore</span>
                  <span style={{ color: '#cbd5e0' }}>•</span>
                  <span><FontAwesomeIcon icon={faCalendarAlt} /> Aug 18-20, 2027</span>
                </div>
                
                <div className={styles.statusGrid}>
                  <div className={styles.statusGroup}>
                    <span className={styles.statusLabel}>Registration Status</span>
                    <span className={styles.badgeYellow}>Pending</span>
                  </div>
                  <div className={styles.statusGroup}>
                    <span className={styles.statusLabel}>Payment Status</span>
                    <span className={styles.badgeRed}>Unpaid</span>
                  </div>
                </div>

                <div className={styles.tagsRow}>
                  <span className={`${styles.tagPill} ${styles.tagBlue}`}>1 Delegate</span>
                  <span className={`${styles.tagPill} ${styles.tagGray}`}>No Spouse</span>
                  <span className={`${styles.tagPill} ${styles.tagGray}`}>No VIP Table</span>
                  <span className={`${styles.tagPill} ${styles.tagGray}`}>Silver Sponsor</span>
                  <span className={`${styles.tagPill} ${styles.tagBlue}`}>Total USD 2,450.00</span>
                </div>

                <div className={styles.cardActionsRow}>
                  <button className={styles.btnOutlineBlue}>
                    <FontAwesomeIcon icon={faCog} /> Manage Registration
                  </button>
                  <button className={styles.btnSolidBlue}>
                    <FontAwesomeIcon icon={faWallet} /> Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className={styles.historySection}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>Event Registrations</h2>
            
            <div className={styles.historyHeaderRow}>
              <div className={styles.filterTabs}>
                {['All', 'Upcoming', 'Previous', 'Paid', 'Unpaid'].map(tab => (
                  <button 
                    key={tab}
                    className={`${styles.filterTab} ${filterTab === tab ? styles.filterTabActive : ''}`}
                    onClick={() => handleFilterChange(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className={styles.historySearchBox}>
                <input type="text" placeholder="Search events..." />
                <FontAwesomeIcon icon={faSearch} />
              </div>
            </div>

            <div className={styles.historyTableWrapper}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Registration Details</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.length > 0 ? filteredRegistrations.map((reg, idx) => (
                    <tr key={reg.id}>
                      <td>
                        <div className={styles.eventNameCell}>
                          <div className={`${styles.eventIconBadge} ${idx % 3 === 0 ? styles.bgBlue : idx % 3 === 1 ? styles.bgOrange : styles.bgGreen}`}>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                          </div>
                          {reg.name}
                        </div>
                      </td>
                      <td><div className={styles.textCell}>{reg.date}</div></td>
                      <td>
                        <div className={styles.textCell}>
                          <FontAwesomeIcon icon={reg.location === 'Virtual' ? faVideo : faMapMarkerAlt} /> {reg.location}
                        </div>
                      </td>
                      <td>
                        <div className={styles.tagsCell}>
                          <span className={`${styles.tagPill} ${styles.tagBlue}`}>{reg.delegates} Delegate{reg.delegates > 1 ? 's' : ''}</span>
                          {reg.spouses > 0 ? (
                            <span className={`${styles.tagPill} ${styles.tagOrange}`}>{reg.spouses} Spouse{reg.spouses > 1 ? 's' : ''}</span>
                          ) : (
                            <span className={`${styles.tagPill} ${styles.tagGray}`}>No Spouse</span>
                          )}
                          {reg.vipTables > 0 && (
                            <span className={`${styles.tagPill} ${styles.tagPurple}`}>{reg.vipTables} VIP Table</span>
                          )}
                          {reg.sponsor && (
                            <span className={`${styles.tagPill} ${styles.tagOrange}`}>{reg.sponsor}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={reg.paymentStatus === 'Paid' ? styles.badgeGreen : styles.badgeRed}>
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={reg.attendanceStatus === 'Attended' || reg.attendanceStatus === 'Confirmed' ? styles.badgeGreen : reg.attendanceStatus === 'No Show' ? styles.badgeRed : styles.badgeYellow} style={{ background: reg.attendanceStatus === 'Attended' || reg.attendanceStatus === 'Confirmed' ? '#f0fff4' : reg.attendanceStatus === 'No Show' ? '#fff5f5' : '#fffaf0', borderColor: 'transparent', padding: '4px 10px' }}>
                          {reg.attendanceStatus === 'Attended' || reg.attendanceStatus === 'Confirmed' ? <FontAwesomeIcon icon={faCheckCircle, faLock, faStar, faBell, faInfoCircle, faCheck} /> : null} {reg.attendanceStatus}
                        </span>
                      </td>
                      <td><span className={styles.actionLink}>View Details <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '10px' }} /></span></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                        No registrations found for the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

            {activeTab === 'scheduler' && (
        <div className={styles.schedulerGrid}>
          {/* Left Column */}
          <div className={styles.schedulerCard}>
            <div className={styles.schHeaderRow}>
              <div className={styles.schHeaderIcon}>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className={styles.schHeaderText}>
                <h2>One to One Scheduler <span className={styles.badgeComingSoon}><FontAwesomeIcon icon={faLock} style={{fontSize: '10px'}}/> Coming Soon</span></h2>
                <p>Plan one-to-one meetings with other participants once scheduling opens.</p>
              </div>
            </div>

            <div className={styles.schBodyRow}>
              <div className={styles.schIllustrationBox}>
                                <svg width="100%" height="180" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="30" y="30" width="140" height="100" rx="12" fill="#fff" stroke="#3182ce" strokeWidth="6"/>
                  <path d="M50 15 L50 45 M150 15 L150 45" stroke="#3182ce" strokeWidth="8" strokeLinecap="round"/>
                  <rect x="30" y="60" width="140" height="6" fill="#3182ce"/>
                  <rect x="50" y="80" width="15" height="15" rx="3" fill="#bee3f8"/>
                  <rect x="75" y="80" width="15" height="15" rx="3" fill="#bee3f8"/>
                  <rect x="100" y="80" width="15" height="15" rx="3" fill="#3182ce"/>
                  <rect x="125" y="80" width="15" height="15" rx="3" fill="#bee3f8"/>
                  <rect x="50" y="105" width="15" height="15" rx="3" fill="#bee3f8"/>
                  <rect x="75" y="105" width="15" height="15" rx="3" fill="#bee3f8"/>
                  <rect x="100" y="105" width="15" height="15" rx="3" fill="#bee3f8"/>
                  <rect x="125" y="105" width="15" height="15" rx="3" fill="#bee3f8"/>
                  <circle cx="150" cy="115" r="25" fill="#0047b3" stroke="#fff" strokeWidth="4"/>
                  <path d="M150 102 V115 H158" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.schInfoList}>
                <div className={styles.schInfoItem}>
                  <div className={styles.schInfoIcon}><FontAwesomeIcon icon={faCalendarAlt} /></div>
                  <div className={styles.schInfoText}>
                    <h4>One to One Scheduler will open 2 weeks before the event.</h4>
                    <p>Available for paid members only.</p>
                  </div>
                </div>
                <div className={styles.schInfoItem}>
                  <div className={styles.schInfoIcon}><FontAwesomeIcon icon={faStar} /></div>
                  <div className={styles.schInfoText}>
                    <h4>Sponsors will receive early access.</h4>
                    <p>Sponsors can start scheduling before general paid members.</p>
                  </div>
                </div>
                <div className={styles.schInfoItem}>
                  <div className={styles.schInfoIcon}><FontAwesomeIcon icon={faBell} /></div>
                  <div className={styles.schInfoText}>
                    <h4>You will be notified once scheduling becomes available.</h4>
                    <p>We'll send you an email and in-app notification.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.schFooterBanner}>
              <FontAwesomeIcon icon={faInfoCircle} />
              You will be able to book, accept, and manage meetings when the scheduler becomes available.
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.schedulerCardRight}>
            
            <div>
              <div className={styles.rightSectionTitle}>Selected Event</div>
              <div className={styles.selectedEventBox}>
                <div className={styles.selectedEventLogo}>
                  INO<br/>SUMMIT
                </div>
                <div className={styles.selectedEventInfo}>
                  <h4>INO SUMMIT FM 10TH AGM 2025 <span className={styles.badgeGreen} style={{marginTop: '4px'}}>Registered</span></h4>
                  <p><FontAwesomeIcon icon={faCalendarAlt} style={{color: 'var(--primary-blue)'}} /> Jun 10 - Jun 12, 2025</p>
                  <p><FontAwesomeIcon icon={faMapMarkerAlt} style={{color: 'var(--primary-blue)'}} /> Athens, Greece</p>
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0' }} />

            <div>
              <div className={styles.rightSectionTitle}>Scheduler Opening Window</div>
              <div className={styles.schAlertBox}>
                <FontAwesomeIcon icon={faClock} />
                <div>
                  <h5>Opens 2 weeks before the event</h5>
                  <p>May 27, 2025 at 2:00 PM Hong Kong Time (GMT+8)</p>
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0' }} />

            <div>
              <div className={styles.rightSectionTitle}>Who Can Access</div>
              <div className={styles.whoAccessList}>
                <div className={styles.whoAccessItem}>
                  <FontAwesomeIcon icon={faCheckCircle} className={`${styles.whoAccessIcon} ${styles.iconGreen}`} />
                  <div>
                    <h5>Paid Members</h5>
                    <p>Access opens for all paid members when the scheduler opens.</p>
                  </div>
                </div>
                <div className={styles.whoAccessItem}>
                  <FontAwesomeIcon icon={faStar} className={`${styles.whoAccessIcon} ${styles.iconOrange}`} />
                  <div>
                    <h5>Sponsors (Early Access)</h5>
                    <p>Sponsors get early access to schedule meetings before paid members.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.infoSmBanner}>
              <FontAwesomeIcon icon={faInfoCircle} />
              All times shown in Hong Kong Time (GMT+8)
            </div>

          </div>
        </div>
      )}
      {(activeTab === 'upcoming' || activeTab === 'previous') && (
        <div className={styles.paginationArea}>
          <span>Showing 1 to 4 of 12 events</span>
          <div className={styles.paginationControls}>
            <button className={styles.pageBtn}><FontAwesomeIcon icon={faChevronLeft} /></button>
            <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>3</button>
            <button className={styles.pageBtn}><FontAwesomeIcon icon={faChevronRight} /></button>
            <div className={styles.perPageSelect}>
              <span>Show</span>
              <select defaultValue="8">
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="12">12</option>
              </select>
              <span>per page</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}