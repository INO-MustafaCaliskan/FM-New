"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./top-freight-talk-users.css";

const featuredUsers = [
    {
        id: 1,
        rank: 1,
        name: "Alex R.",
        company: "Global Logistics GmbH",
        countryCode: "de",
        imageUrl: "/images/personExample.jpg",
        rating: "5.0",
        reviews: "28 Reviews",
        quote: "Alex is a reliable partner. Fast response and great support throughout the shipment.",
        author: "Maria D.",
        authorCompany: "Oceanic Freight Solutions",
        authorCountryCode: "us",
    },
    {
        id: 2,
        rank: 2,
        name: "Ahmed Al M.",
        company: "Al Maha Logistics",
        countryCode: "ae",
        imageUrl: "/images/sample-image-01.jpg",
        rating: "4.9",
        reviews: "24 Reviews",
        quote: "Professional, trustworthy and very experienced team. Highly recommended.",
        author: "John P.",
        authorCompany: "Swift Cargo Pte Ltd",
        authorCountryCode: "sg",
    },
    {
        id: 3,
        rank: 3,
        name: "Maria D.",
        company: "Oceanic Freight Solutions",
        countryCode: "us",
        imageUrl: "/images/contact_us_photo.webp",
        rating: "4.9",
        reviews: "22 Reviews",
        quote: "Great communication and always finds the best solutions. A true logistics expert.",
        author: "Carlos M.",
        authorCompany: "TransGlobal Forwarders",
        authorCountryCode: "br",
    },
    {
        id: 4,
        rank: 4,
        name: "Wei Chen",
        company: "EastBridge Logistics",
        countryCode: "cn",
        imageUrl: "/images/sample-image-02.jpg",
        rating: "4.8",
        reviews: "22 Reviews",
        quote: "Very cooperative and punctual. It’s a pleasure working with Wei and his team.",
        author: "Priya S.",
        authorCompany: "India Freight Network",
        authorCountryCode: "in",
    },
    {
        id: 5,
        rank: 5,
        name: "Lars N.",
        company: "Northline Forwarding",
        countryCode: "nl",
        imageUrl: "/images/sample-image-08.jpg",
        rating: "4.8",
        reviews: "19 Reviews",
        quote: "Excellent service and deep industry knowledge. We’ve worked on many deals.",
        author: "Omar H.",
        authorCompany: "Middle East Logistics",
        authorCountryCode: "ae",
    },
];

const thisMonthForwarderList = [
    { id: 1, rank: 1, name: "Global Logistics GmbH", countryCode: "de", imageUrl: "/images/personExample.jpg", rating: "5.0", reviews: "28 Reviews" },
    { id: 2, rank: 2, name: "Al Maha Logistics", countryCode: "ae", imageUrl: "/images/sample-image-01.jpg", rating: "4.9", reviews: "24 Reviews" },
    { id: 3, rank: 3, name: "Oceanic Freight Solutions", countryCode: "us", imageUrl: "/images/contact_us_photo.webp", rating: "4.8", reviews: "22 Reviews" },
    { id: 4, rank: 4, name: "Northline Forwarding", countryCode: "nl", imageUrl: "/images/sample-image-02.jpg", rating: "4.7", reviews: "17 Reviews" },
    { id: 5, rank: 5, name: "TransGlobal Forwarders", countryCode: "br", imageUrl: "/images/sample-image-08.jpg", rating: "4.7", reviews: "16 Reviews" },
];

const todayForwarderList = [
    { id: 1, rank: 1, name: "Oceanic Freight Solutions", countryCode: "us", imageUrl: "/images/contact_us_photo.webp", rating: "5.0", reviews: "8 Reviews" },
    { id: 2, rank: 2, name: "Northline Forwarding", countryCode: "nl", imageUrl: "/images/sample-image-02.jpg", rating: "4.9", reviews: "7 Reviews" },
    { id: 3, rank: 3, name: "Al Maha Logistics", countryCode: "ae", imageUrl: "/images/sample-image-01.jpg", rating: "4.8", reviews: "6 Reviews" },
    { id: 4, rank: 4, name: "EastBridge Logistics", countryCode: "cn", imageUrl: "/images/personExample.jpg", rating: "4.7", reviews: "5 Reviews" },
    { id: 5, rank: 5, name: "Swift Cargo Pte Ltd", countryCode: "sg", imageUrl: "/images/sample-image-08.jpg", rating: "4.7", reviews: "5 Reviews" },
];

const filterOptions = [
    { key: "today", label: "Today" },
    { key: "month", label: "This Month" },
];

const getInitials = (name) =>
    name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

const getFlagEmoji = (countryCode) => {
    if (!countryCode || countryCode.length !== 2) {
        return "";
    }

    return countryCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
};

const renderStars = (rating) => {
    const value = Number.parseFloat(rating);
    const fullStars = Number.isFinite(value) ? Math.round(value) : 5;
    return "★".repeat(fullStars).padEnd(5, "☆");
};

const TopFreightTalkUsers = () => {
    const [selectedFilter, setSelectedFilter] = useState("month");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
    const featuredRowRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const activeFilter = filterOptions.find((option) => option.key === selectedFilter) ?? filterOptions[1];
    const visibleForwarderList = selectedFilter === "today" ? todayForwarderList : thisMonthForwarderList;

    const scrollFeaturedCards = (direction) => {
        const row = featuredRowRef.current;
        if (!row) {
            return;
        }

        const scrollAmount = Math.max(220, Math.round(row.clientWidth * 0.72));
        row.scrollBy({
            left: direction * scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <section className="top-freight-talk-users mt-5 mb-5">
            <div className="container">
                <div className="top-freight-talk-users__layout">
                    <div className="top-freight-talk-users__featured-panel">
                        <div className="top-freight-talk-users__featured-inner-header">
                            <div>
                                <div className="top-freight-talk-users__title-row mt-2">
                                    <h3 className="top-freight-talk-users__panel-title mb-2">Top Freight Talk Users</h3>
                                    <span className="freight-quote-live-pill">LIVE</span>
                                </div>
                                <p className="top-freight-talk-users__subtitle mb-0">
                                    Highest rated members by the community
                                </p>
                            </div>
                            <div className="top-freight-talk-users__header-actions">
                                <Link href="/sign-up" className="top-freight-talk-users__view-all top-freight-talk-users__view-all-btn">
                                    View all members <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </div>

                        <div className="top-freight-talk-users__featured-nav">
                            <button
                                type="button"
                                className="top-freight-talk-users__scroll-btn"
                                aria-label="Previous cards"
                                onClick={() => scrollFeaturedCards(-1)}
                            >
                                <span
                                    className="top-freight-talk-users__scroll-icon top-freight-talk-users__scroll-icon--left"
                                    aria-hidden="true"
                                />
                            </button>

                            <div className="top-freight-talk-users__featured-row" ref={featuredRowRef}>
                                {featuredUsers.map((user) => (
                                    <article key={user.id} className="top-freight-talk-users__card">
                                        <div className="top-freight-talk-users__rank-badge">{user.rank}</div>
                                        <div className="top-freight-talk-users__card-top">
                                            <div className="top-freight-talk-users__avatar">
                                                {user.imageUrl ? (
                                                    <Image
                                                        src={user.imageUrl}
                                                        alt={user.name}
                                                        width={54}
                                                        height={54}
                                                        className="top-freight-talk-users__avatar-image"
                                                    />
                                                ) : (
                                                    getInitials(user.name)
                                                )}
                                            </div>
                                            <div className="top-freight-talk-users__card-person">
                                                <div className="top-freight-talk-users__card-name-row">
                                                    <h3 className="top-freight-talk-users__card-name">{user.name}</h3>
                                                    <span className="top-freight-talk-users__flag" aria-hidden="true">
                                                        {getFlagEmoji(user.countryCode)}
                                                    </span>
                                                </div>
                                                <p className="top-freight-talk-users__card-company">{user.company}</p>
                                            </div>
                                        </div>

                                        <div className="top-freight-talk-users__stars">{renderStars(user.rating)}</div>

                                        <div className="top-freight-talk-users__rating-block">
                                            <div className="top-freight-talk-users__rating">{user.rating}</div>
                                            <div className="top-freight-talk-users__reviews">{user.reviews}</div>
                                        </div>

                                        <p className="top-freight-talk-users__quote">“{user.quote}”</p>

                                        <div className="top-freight-talk-users__card-body">
                                            <div className="top-freight-talk-users__author">
                                                <div className="top-freight-talk-users__author-avatar">{getInitials(user.author)}</div>
                                                <div>
                                                    <div className="top-freight-talk-users__author-name">{user.author}</div>
                                                    <div className="top-freight-talk-users__author-company">
                                                        {user.authorCompany}{" "}
                                                        <span className="top-freight-talk-users__flag" aria-hidden="true">
                                                            {getFlagEmoji(user.authorCountryCode)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="top-freight-talk-users__scroll-btn"
                                aria-label="Next cards"
                                onClick={() => scrollFeaturedCards(1)}
                            >
                                <span
                                    className="top-freight-talk-users__scroll-icon top-freight-talk-users__scroll-icon--right"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>

                    <aside className="top-freight-talk-users__list-panel">
                        <div className="top-freight-talk-users__list-head">
                            <h3 className="top-freight-talk-users__panel-title">Top Freight Forwarders</h3>
                            <div className="top-freight-talk-users__filter" ref={filterRef}>
                                <button
                                    type="button"
                                    className="top-freight-talk-users__month-filter"
                                    aria-haspopup="menu"
                                    aria-expanded={isFilterOpen}
                                    onClick={() => setIsFilterOpen((value) => !value)}
                                >
                                    {activeFilter.label} <span aria-hidden="true">▾</span>
                                </button>
                                {isFilterOpen ? (
                                    <div className="top-freight-talk-users__filter-menu" role="menu">
                                        {filterOptions.map((option) => (
                                            <button
                                                key={option.key}
                                                type="button"
                                                className={`top-freight-talk-users__filter-option${selectedFilter === option.key ? " is-active" : ""
                                                    }`}
                                                role="menuitemradio"
                                                aria-checked={selectedFilter === option.key}
                                                onClick={() => {
                                                    setSelectedFilter(option.key);
                                                    setIsFilterOpen(false);
                                                }}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="top-freight-talk-users__list">
                            {visibleForwarderList.map((forwarder, index) => (
                                <div key={forwarder.id} className="top-freight-talk-users__list-item">
                                    <div className="top-freight-talk-users__rank top-freight-talk-users__rank--list">
                                        0{index + 1}
                                    </div>
                                    <div className="top-freight-talk-users__list-avatar">
                                        {forwarder.imageUrl ? (
                                            <Image
                                                src={forwarder.imageUrl}
                                                alt={forwarder.name}
                                                width={38}
                                                height={38}
                                                className="top-freight-talk-users__list-avatar-image"
                                            />
                                        ) : (
                                            getInitials(forwarder.name)
                                        )}
                                    </div>
                                    <div className="top-freight-talk-users__list-content">
                                        <h3 className="top-freight-talk-users__list-name">{forwarder.name}</h3>
                                        <div className="top-freight-talk-users__list-stars">{renderStars(forwarder.rating)}</div>
                                    </div>
                                    <div className="top-freight-talk-users__list-meta">
                                        <div className="top-freight-talk-users__list-rating">{forwarder.rating}</div>
                                        <div className="top-freight-talk-users__list-reviews">{forwarder.reviews}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default TopFreightTalkUsers;