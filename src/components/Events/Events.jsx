"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Events.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, faBookmark, faCalendarAlt, faClock, faVideo, faMapMarkerAlt, faChevronLeft, faChevronRight, faCog, faWallet, faCheckCircle 
} from "@fortawesome/free-solid-svg-icons";

export default function Events() {
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("eventsActiveTab");
      if (savedTab) setActiveTab(savedTab);
    }
  }, []);

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

      <div className={styles.searchArea}>
        <div className={styles.searchInputBox}>
          <input type="text" placeholder="Search events by title, keyword..." />
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
        </div>
      </div>

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
          <div className={styles.registrationsSubtitle}>
            Manage your upcoming event registrations, participant details, invoices, and past event records in one place.
          </div>

          {/* Active Registrations Section */}
          <div>
            <div className={styles.sectionTitleRow}>
              <h2 className={styles.sectionTitle}>Upcoming / Active Registrations</h2>
              <span className={styles.countBadge} style={{ marginBottom: '0px' }}>
                2
              </span>
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
                <button className={`${styles.filterTab} ${styles.filterTabActive}`}>All</button>
                <button className={styles.filterTab}>Upcoming</button>
                <button className={styles.filterTab}>Previous</button>
                <button className={styles.filterTab}>Paid</button>
                <button className={styles.filterTab}>Unpaid</button>
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
                  {/* Row 1 */}
                  <tr>
                    <td>
                      <div className={styles.eventNameCell}>
                        <div className={`${styles.eventIconBadge} ${styles.bgBlue}`}><FontAwesomeIcon icon={faCalendarAlt} /></div>
                        FM Annual Conference 2026
                      </div>
                    </td>
                    <td><div className={styles.textCell}>Jan 27-24, 2026</div></td>
                    <td>
                      <div className={styles.textCell}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> Barcelona, Spain
                      </div>
                    </td>
                    <td>
                      <div className={styles.tagsCell}>
                        <span className={`${styles.tagPill} ${styles.tagBlue}`}>2 Delegates</span>
                        <span className={`${styles.tagPill} ${styles.tagOrange}`}>1 Spouse</span>
                        <span className={`${styles.tagPill} ${styles.tagOrange}`}>Bronze Sponsor</span>
                      </div>
                    </td>
                    <td><span className={styles.badgeGreen}>Paid</span></td>
                    <td><span className={styles.badgeGreen} style={{ background: '#f0fff4', borderColor: 'transparent', padding: '4px 10px' }}><FontAwesomeIcon icon={faCheckCircle} /> Attended</span></td>
                    <td><span className={styles.actionLink}>View Details <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '10px' }} /></span></td>
                  </tr>

                  {/* Row 2 */}
                  <tr>
                    <td>
                      <div className={styles.eventNameCell}>
                        <div className={`${styles.eventIconBadge} ${styles.bgOrange}`}><FontAwesomeIcon icon={faCalendarAlt} /></div>
                        FM Regional Meeting 2025
                      </div>
                    </td>
                    <td><div className={styles.textCell}>Oct 05-06, 2025</div></td>
                    <td>
                      <div className={styles.textCell}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> Dubai, UAE
                      </div>
                    </td>
                    <td>
                      <div className={styles.tagsCell}>
                        <span className={`${styles.tagPill} ${styles.tagBlue}`}>1 Delegate</span>
                        <span className={`${styles.tagPill} ${styles.tagGray}`}>No Spouse</span>
                        <span className={`${styles.tagPill} ${styles.tagGray}`}>No VIP Table</span>
                      </div>
                    </td>
                    <td><span className={styles.badgeGreen}>Paid</span></td>
                    <td><span className={styles.badgeGreen} style={{ background: '#f0fff4', borderColor: 'transparent', padding: '4px 10px' }}><FontAwesomeIcon icon={faCheckCircle} /> Attended</span></td>
                    <td><span className={styles.actionLink}>View Details <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '10px' }} /></span></td>
                  </tr>

                  {/* Row 3 */}
                  <tr>
                    <td>
                      <div className={styles.eventNameCell}>
                        <div className={`${styles.eventIconBadge} ${styles.bgGreen}`}><FontAwesomeIcon icon={faCalendarAlt} /></div>
                        FM AGM 2024
                      </div>
                    </td>
                    <td><div className={styles.textCell}>Mar 18-19, 2024</div></td>
                    <td>
                      <div className={styles.textCell}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> Bangkok, Thailand
                      </div>
                    </td>
                    <td>
                      <div className={styles.tagsCell}>
                        <span className={`${styles.tagPill} ${styles.tagBlue}`}>2 Delegates</span>
                        <span className={`${styles.tagPill} ${styles.tagPurple}`}>1 VIP Table</span>
                        <span className={`${styles.tagPill} ${styles.tagGray}`}>Silver Sponsor</span>
                      </div>
                    </td>
                    <td><span className={styles.badgeGreen}>Paid</span></td>
                    <td><span className={styles.badgeGreen} style={{ background: '#f0fff4', borderColor: 'transparent', padding: '4px 10px' }}><FontAwesomeIcon icon={faCheckCircle} /> Attended</span></td>
                    <td><span className={styles.actionLink}>View Details <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '10px' }} /></span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scheduler' && (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#718096' }}>
          <h3>One to One Scheduler content coming soon...</h3>
        </div>
      )}

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

    </div>
  );
}