"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faMapMarkerAlt, faPhone, faStream, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter, faLinkedinIn, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Us", dropdown: [
      { label: "Team",             href: "/about/team" },
      { label: "Milestones",       href: "/about/milestones" },
      { label: "Chairman Message", href: "/about/ceo-message" },
  ]},
  { label: "Testimonials", href: "/testimonials" },
  { label: "Directory",    href: "/global-networkers" },
  { label: "Events", dropdown: [
      { label: "Upcoming Meetings", href: "/events/upcoming" },
      { label: "Previous Meetings", href: "/events/previous" },
  ]},
  { label: "Membership", dropdown: [
      { label: "Details",   href: "/membership/details" },
      { label: "Benefits",  href: "/membership/benefits" },
      { label: "Apply Now", href: "/sign-up" },
  ]},
  { label: "More", dropdown: [
      { label: "Blog",               href: "/blog" },
      { label: "FAQ",                href: "/faq" },
      { label: "Blacklisted Agents", href: "/blacklisted-agents" },
      { label: "Contact Us",         href: "/contact" },
      { label: "Terms & Conditions", href: "/terms" },
  ]},
];

const SOCIAL_LINKS = [
  { icon: faFacebookF,  href: "https://facebook.com",  label: "Facebook"  },
  { icon: faTwitter,    href: "https://twitter.com",    label: "Twitter"   },
  { icon: faLinkedinIn, href: "https://linkedin.com",   label: "LinkedIn"  },
  { icon: faInstagram,  href: "https://instagram.com",  label: "Instagram" },
  { icon: faYoutube,    href: "https://youtube.com",    label: "YouTube"   },
];

const BiArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{marginLeft:"5px",verticalAlign:"middle"}}>
    <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
    <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
  </svg>
);

export default function Header() {
  const pathName = usePathname();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const isActive  = (href) => href === "/" ? pathName === "/" : pathName?.startsWith(href);
  const toggleDrop = (label) => setOpenDropdown((p) => (p === label ? null : label));
  const closeAll   = () => { setMobileOpen(false); setOpenDropdown(null); };

  return (
    <header className={styles.header}>

      {/* ── TOP BAR ─────────────────────────────────── */}
      <div className={styles.headerTop}>
        <div className="container">
          <div className={styles.headerTopWrapper}>

            <div className={styles.headerTopLeft}>
              <div className={styles.headerTopContact}>
                <ul>
                  <li>
                    <a href="/contact#map">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.contactIcon} />
                      İzmir / TÜRKİYE
                    </a>
                  </li>
                  <li>
                    <a href="tel:+902325028488">
                      <FontAwesomeIcon icon={faPhone} className={styles.contactIcon} />
                      +90 232 502 84 88
                    </a>
                  </li>
                  <li>
                    <a href="mailto:info@freightmidpoint.com">
                      <FontAwesomeIcon icon={faEnvelope} className={styles.contactIcon} />
                      info[at]freightmidpoint.com
                    </a>
                  </li>
                  <li>
                    <div className={styles.headerTopSocial}>
                      {SOCIAL_LINKS.map((s) => (
                        <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                          <FontAwesomeIcon icon={s.icon} />
                        </a>
                      ))}
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className={`${styles.headerTopRight} ${styles.userMenuArea}`}>
              <Link href="/sign-in" className={styles.loginBtnTop}>
                Login <BiArrow />
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── MAIN NAV ────────────────────────────────── */}
      <div className={styles.mainNavigation}>
        <nav className={styles.navbar}>
          <div className="container">
            <div className={styles.navbarInner}>

              <Link href="/" className={styles.navbarBrand}>
                <Image src="/images/FM_Logo.png" alt="Freight Midpoint"
                  width={280} height={80} className={styles.logoImg} priority />
              </Link>

              <div className={styles.mobileMenuRight}>
                <button className={styles.navbarToggler} aria-label="Toggle navigation"
                  onClick={() => setMobileOpen((v) => !v)}>
                  <span className={styles.navbarTogglerIcon}>
                    <FontAwesomeIcon icon={faStream} />
                  </span>
                </button>
              </div>

              <div className={`${styles.navbarCollapse}${mobileOpen ? " " + styles.open : ""}`}>
                <ul className={styles.navMenu}>

                  <li className={styles.mobilLogin}>
                    <Link href="/sign-in" className={styles.mobilLoginLink} onClick={closeAll}>
                      Login <BiArrow />
                    </Link>
                    <Link href="/sign-up" className={styles.mobilApplyLink} onClick={closeAll}>
                      Apply Now
                    </Link>
                  </li>

                  {NAV_ITEMS.map((item) =>
                    item.dropdown ? (
                      <li key={item.label} className={styles.navItem}>
                        <button className={`${styles.navLink} ${styles.dropdownToggle}`}
                          onClick={() => toggleDrop(item.label)}>
                          {item.label}
                          <span className={styles.dropdownCaret}>
                            {openDropdown === item.label ? "−" : "+"}
                          </span>
                        </button>
                        <ul className={`${styles.dropdownMenu}${openDropdown === item.label ? " " + styles.dropdownMenuOpen : ""}`}>
                          {item.dropdown.map((sub) => (
                            <li key={sub.label}>
                              <Link href={sub.href}
                                className={`${styles.dropdownItem}${isActive(sub.href) ? " " + styles.dropdownItemActive : ""}`}
                                onClick={closeAll}>
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li key={item.label} className={styles.navItem}>
                        <Link href={item.href}
                          className={`${styles.navLink}${isActive(item.href) ? " " + styles.navLinkActive : ""}`}
                          onClick={closeAll}>
                          {item.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>

                <div className={styles.headerBtnArea}>
                  <Link href="/sign-up" className={styles.themeBtn}>
                    Apply Now
                    <span className={styles.themeBtnIcon}>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </nav>
      </div>

    </header>
  );
}
