

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import "./freight-quote.css";

const getFlagSrc = (iso) => {
    if (!iso) {
        return "/images/no-flag.png";
    }

    const normalizedIso = iso.toLowerCase();
    if (normalizedIso === "trnc") {
        return "/images/north-cyprus.png";
    }

    return `https://flagcdn.com/w20/${normalizedIso}.png`;
};

const freightQuoteRequests = [
    {
        id: 1,
        fromCity: "Shanghai",
        fromCountry: "China",
        fromIso: "cn",
        toCity: "Rotterdam",
        toCountry: "Netherlands",
        toIso: "nl",
        mode: "Sea Freight",
        equipmentOrCargo: "40' HC Container",
        details: "General Cargo",
        detailTag: "FOB",
        requested: "Just now",
    },
    {
        id: 2,
        fromCity: "Istanbul",
        fromCountry: "Turkey",
        fromIso: "tr",
        toCity: "Chicago",
        toCountry: "USA",
        toIso: "us",
        mode: "Air Freight",
        equipmentOrCargo: "3 Pallets / 450 kg",
        details: "Electronics",
        detailTag: "Door to Door",
        requested: "3 min ago",
    },
    {
        id: 3,
        fromCity: "Dubai",
        fromCountry: "UAE",
        fromIso: "ae",
        toCity: "Riyadh",
        toCountry: "Saudi Arabia",
        toIso: "sa",
        mode: "Road Freight",
        equipmentOrCargo: "Low Bed",
        details: "Machinery",
        detailTag: "FTL",
        requested: "7 min ago",
    },
    {
        id: 4,
        fromCity: "Mumbai",
        fromCountry: "India",
        fromIso: "in",
        toCity: "Hamburg",
        toCountry: "Germany",
        toIso: "de",
        mode: "Sea Freight",
        equipmentOrCargo: "20' DC Container",
        details: "Textile",
        detailTag: "CIF",
        requested: "12 min ago",
    },
    {
        id: 5,
        fromCity: "Shenzhen",
        fromCountry: "China",
        fromIso: "cn",
        toCity: "Santos",
        toCountry: "Brazil",
        toIso: "br",
        mode: "Air Freight",
        equipmentOrCargo: "5 Pallets / 820 kg",
        details: "Auto Parts",
        detailTag: "Door to Airport",
        requested: "18 min ago",
    },
    {
        id: 6,
        fromCity: "Seoul",
        fromCountry: "South Korea",
        fromIso: "kr",
        toCity: "Dubai",
        toCountry: "UAE",
        toIso: "ae",
        mode: "Air Freight",
        equipmentOrCargo: "2 Pallets / 310 kg",
        details: "Medical Devices",
        detailTag: "Express",
        requested: "26 min ago",
    },
    {
        id: 7,
        fromCity: "Valencia",
        fromCountry: "Spain",
        fromIso: "es",
        toCity: "Casablanca",
        toCountry: "Morocco",
        toIso: "ma",
        mode: "Sea Freight",
        equipmentOrCargo: "40' Reefer",
        details: "Fresh Produce",
        detailTag: "CFR",
        requested: "35 min ago",
    },
    {
        id: 8,
        fromCity: "Bursa",
        fromCountry: "Turkey",
        fromIso: "tr",
        toCity: "Sofia",
        toCountry: "Bulgaria",
        toIso: "bg",
        mode: "Road Freight",
        equipmentOrCargo: "Curtainsider",
        details: "Automotive Parts",
        detailTag: "LTL",
        requested: "44 min ago",
    },
    {
        id: 9,
        fromCity: "Bangkok",
        fromCountry: "Thailand",
        fromIso: "th",
        toCity: "Frankfurt",
        toCountry: "Germany",
        toIso: "de",
        mode: "Air Freight",
        equipmentOrCargo: "4 Pallets / 700 kg",
        details: "E-commerce",
        detailTag: "Door to Door",
        requested: "55 min ago",
    },
    {
        id: 10,
        fromCity: "Izmir",
        fromCountry: "Turkey",
        fromIso: "tr",
        toCity: "Trieste",
        toCountry: "Italy",
        toIso: "it",
        mode: "Sea Freight",
        equipmentOrCargo: "45' PW Container",
        details: "FMCG",
        detailTag: "FOB",
        requested: "1 hour ago",
    },
    {
        id: 11,
        fromCity: "Guangzhou",
        fromCountry: "China",
        fromIso: "cn",
        toCity: "Los Angeles",
        toCountry: "USA",
        toIso: "us",
        mode: "Sea Freight",
        equipmentOrCargo: "40' HC Container",
        details: "Consumer Goods",
        detailTag: "CIF",
        requested: "1 hour 15 min ago",
    },
    {
        id: 12,
        fromCity: "Warsaw",
        fromCountry: "Poland",
        fromIso: "pl",
        toCity: "Vienna",
        toCountry: "Austria",
        toIso: "at",
        mode: "Road Freight",
        equipmentOrCargo: "Mega Trailer",
        details: "Furniture",
        detailTag: "FTL",
        requested: "1 hour 35 min ago",
    },
    {
        id: 13,
        fromCity: "Doha",
        fromCountry: "Qatar",
        fromIso: "qa",
        toCity: "Nairobi",
        toCountry: "Kenya",
        toIso: "ke",
        mode: "Air Freight",
        equipmentOrCargo: "1 Pallet / 180 kg",
        details: "Pharma",
        detailTag: "Cold Chain",
        requested: "2 hours ago",
    },
    {
        id: 14,
        fromCity: "Antwerp",
        fromCountry: "Belgium",
        fromIso: "be",
        toCity: "Jeddah",
        toCountry: "Saudi Arabia",
        toIso: "sa",
        mode: "Sea Freight",
        equipmentOrCargo: "20' Tank Container",
        details: "Chemicals",
        detailTag: "IMO",
        requested: "2 hours 30 min ago",
    },
    {
        id: 15,
        fromCity: "Samsun",
        fromCountry: "Turkey",
        fromIso: "tr",
        toCity: "Bucharest",
        toCountry: "Romania",
        toIso: "ro",
        mode: "Road Freight",
        equipmentOrCargo: "Frigo Truck",
        details: "Food",
        detailTag: "ATP",
        requested: "3 hours ago",
    },
    {
        id: 16,
        fromCity: "Ho Chi Minh",
        fromCountry: "Vietnam",
        fromIso: "vn",
        toCity: "Melbourne",
        toCountry: "Australia",
        toIso: "au",
        mode: "Sea Freight",
        equipmentOrCargo: "40' HC Container",
        details: "Garments",
        detailTag: "FOB",
        requested: "3 hours 30 min ago",
    },
    {
        id: 17,
        fromCity: "Athens",
        fromCountry: "Greece",
        fromIso: "gr",
        toCity: "Larnaca",
        toCountry: "Cyprus",
        toIso: "cy",
        mode: "Road Freight",
        equipmentOrCargo: "Box Trailer",
        details: "Retail Goods",
        detailTag: "LTL",
        requested: "4 hours ago",
    },
    {
        id: 18,
        fromCity: "Tokyo",
        fromCountry: "Japan",
        fromIso: "jp",
        toCity: "San Jose",
        toCountry: "USA",
        toIso: "us",
        mode: "Air Freight",
        equipmentOrCargo: "6 Pallets / 1.1 tons",
        details: "Semiconductors",
        detailTag: "Priority",
        requested: "4 hours 30 min ago",
    },
    {
        id: 19,
        fromCity: "Le Havre",
        fromCountry: "France",
        fromIso: "fr",
        toCity: "Montreal",
        toCountry: "Canada",
        toIso: "ca",
        mode: "Sea Freight",
        equipmentOrCargo: "40' HC Container",
        details: "Industrial Parts",
        detailTag: "CFR",
        requested: "5 hours ago",
    },
    {
        id: 20,
        fromCity: "Prague",
        fromCountry: "Czechia",
        fromIso: "cz",
        toCity: "Budapest",
        toCountry: "Hungary",
        toIso: "hu",
        mode: "Road Freight",
        equipmentOrCargo: "Curtainsider",
        details: "Paper Products",
        detailTag: "FTL",
        requested: "6 hours ago",
    },
]

const getModeClassName = (mode) => {
    const normalizedMode = mode.toLowerCase();

    if (normalizedMode.includes("air")) {
        return "freight-quote-mode freight-quote-mode--air";
    }

    if (normalizedMode.includes("sea")) {
        return "freight-quote-mode freight-quote-mode--sea";
    }

    return "freight-quote-mode freight-quote-mode--road";
};

const getModeIcon = (mode) => {
    const normalizedMode = mode.toLowerCase();

    if (normalizedMode.includes("air")) {
        return "✈";
    }

    if (normalizedMode.includes("sea")) {
        return "⚓";
    }

    return "🚚";
};

const FreightQuote = () => {
    const tableContainerRef = useRef(null);

    useEffect(() => {
        const container = tableContainerRef.current;
        if (!container) {
            return undefined;
        }

        let animationFrameId;
        let resumeTimeoutId;
        let lastTimestamp = 0;
        const scrollSpeedPxPerSecond = 18;
        let virtualScrollTop = 0;
        let isUserInteracting = false;
        let isMouseHovering = false;

        const pauseAutoScroll = () => {
            isUserInteracting = true;
            if (resumeTimeoutId) {
                window.clearTimeout(resumeTimeoutId);
            }
            resumeTimeoutId = window.setTimeout(() => {
                isUserInteracting = false;
                lastTimestamp = 0;
                virtualScrollTop = container.scrollTop;
            }, 1200);
        };

        const syncVirtualScrollTop = () => {
            virtualScrollTop = container.scrollTop;
        };

        const handleMouseEnter = () => {
            isMouseHovering = true;
            if (resumeTimeoutId) {
                window.clearTimeout(resumeTimeoutId);
            }
        };

        const handleMouseLeave = () => {
            isMouseHovering = false;
            lastTimestamp = 0;
            virtualScrollTop = container.scrollTop;
        };

        container.addEventListener("wheel", pauseAutoScroll, { passive: true });
        container.addEventListener("touchstart", pauseAutoScroll, { passive: true });
        container.addEventListener("touchmove", pauseAutoScroll, { passive: true });
        container.addEventListener("pointerdown", pauseAutoScroll, { passive: true });
        container.addEventListener("scroll", syncVirtualScrollTop, { passive: true });
        container.addEventListener("mouseenter", handleMouseEnter);
        container.addEventListener("mouseleave", handleMouseLeave);

        const animateScroll = (timestamp) => {
            if (isUserInteracting || isMouseHovering) {
                animationFrameId = window.requestAnimationFrame(animateScroll);
                return;
            }

            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }

            const deltaSeconds = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            virtualScrollTop += scrollSpeedPxPerSecond * deltaSeconds;

            const maxScrollTop = container.scrollHeight - container.clientHeight;
            if (maxScrollTop > 0 && virtualScrollTop >= maxScrollTop) {
                virtualScrollTop = 0;
            }

            container.scrollTop = virtualScrollTop;

            animationFrameId = window.requestAnimationFrame(animateScroll);
        };

        animationFrameId = window.requestAnimationFrame(animateScroll);

        return () => {
            container.removeEventListener("wheel", pauseAutoScroll);
            container.removeEventListener("touchstart", pauseAutoScroll);
            container.removeEventListener("touchmove", pauseAutoScroll);
            container.removeEventListener("pointerdown", pauseAutoScroll);
            container.removeEventListener("scroll", syncVirtualScrollTop);
            container.removeEventListener("mouseenter", handleMouseEnter);
            container.removeEventListener("mouseleave", handleMouseLeave);

            if (resumeTimeoutId) {
                window.clearTimeout(resumeTimeoutId);
            }

            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return (
        <section className="freight-quote freight-quote-section mt-5 mb-5">
            <div className="container">
                <div className="freight-quote-head">
                    <h2 className="title title-primary">Latest Freight Quote Requests</h2>
                    <span className="freight-quote-live-pill">Live Feed</span>
                </div>
                <p className="home-what__desc freight-quote-subtitle">
                    Real-time freight quote requests from our global network.
                </p>
            </div>
            <div className="container mt-4">
                <div className="d-flex justify-content-end mb-3">
                    <Link href="/sign-up" className="btn btn-primary btn-sm freight-quote-all-btn">
                        View All Requests
                    </Link>
                </div>
                <div
                    className="table-responsive freight-quote-table-shell"
                    ref={tableContainerRef}
                    style={{ maxHeight: "420px", overflowY: "auto" }}
                >
                    <table className="table table-striped align-middle freight-quote-table">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Mode</th>
                                <th>Equipment/Cargo</th>
                                <th>Details</th>
                                <th></th>
                                <th>Requested</th>
                            </tr>
                        </thead>
                        <tbody>
                            {freightQuoteRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-2 freight-quote-location">
                                            <Image
                                                src={getFlagSrc(request.fromIso)}
                                                alt={request.fromCountry}
                                                width={20}
                                                height={15}
                                                className="freight-quote-flag"
                                            />
                                            <span>{request.fromCity}, <strong>{request.fromCountry}</strong></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2 freight-quote-location">
                                            <Image
                                                src={getFlagSrc(request.toIso)}
                                                alt={request.toCountry}
                                                width={20}
                                                height={15}
                                                className="freight-quote-flag"
                                            />
                                            <span>{request.toCity}, <strong>{request.toCountry}</strong></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="freight-quote-cell-with-icon">
                                            <span className="freight-quote-cell-icon">{getModeIcon(request.mode)}</span>
                                            <span className="freight-quote-mode-text">{request.mode}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="freight-quote-cell-with-icon">
                                            <span className="freight-quote-cell-icon">📦</span>
                                            <span>{request.equipmentOrCargo}</span>
                                        </div>
                                    </td>
                                    <td className="freight-quote-details">
                                        <span className="freight-quote-details-main">{request.details}</span>
                                    </td>
                                    <td className="freight-quote-detail-tag-cell">
                                        <span className="freight-quote-detail-tag">{request.detailTag}</span>
                                    </td>
                                    <td>
                                        <span className="freight-quote-requested">{request.requested}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default FreightQuote