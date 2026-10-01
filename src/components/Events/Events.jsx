"use client";
import React, { useState } from "react";
import styles from "./Events.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, faBookmark, faCalendarAlt, faClock, faVideo, faMapMarkerAlt, 
  faChevronLeft, faChevronRight 
} from "@fortawesome/free-solid-svg-icons";

export default function Events() {
  const [activeTab, setActiveTab] = useState("upcoming");

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

  return (
    <div className={styles.container}>
      
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Events</h1>
        <p className={styles.pageSubtitle}>Discover upcoming network events, meetings, and registration opportunities.</p>
      </div>

      <div className={styles.tabsArea}>
        <div 
          className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'previous' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('previous')}
        >
          Previous Events
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'registrations' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          My Registrations
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'scheduler' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('scheduler')}
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
                <button className={styles.btnPrimary}>Register Now</button>
                <button className={styles.btnSecondary}>Become a Sponsor</button>
                <button className={styles.btnSecondary}>View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

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