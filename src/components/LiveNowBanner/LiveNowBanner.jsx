

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FiGlobe, FiMessageSquare, FiCalendar, FiUsers } from "react-icons/fi";
import "./LiveNowBanner.css";

function randInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextVal(current, step, min, max) {
    const delta = Math.floor(Math.random() * (step * 2 + 1)) - step;
    return Math.min(max, Math.max(min, current + delta));
}

function useAnimatedNumber(target, duration = 1500) {
    const [display, setDisplay] = useState(target);
    const from = useRef(target);

    useEffect(() => {
        const start = from.current;
        const end = target;
        from.current = target;
        if (start === end) return;

        const startTime = performance.now();
        let rafId;

        const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            setDisplay(Math.round(start + (end - start) * ease));
            if (progress < 1) rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [target, duration]);

    return display;
}

function useLiveStat({ min, max, step, interval }) {
    const [target, setTarget] = useState(() => randInRange(min, max));
    const animated = useAnimatedNumber(target);

    useEffect(() => {
        const id = setInterval(
            () => setTarget((prev) => nextVal(prev, step, min, max)),
            interval
        );
        return () => clearInterval(id);
    }, [min, max, step, interval]);

    return animated;
}

const LiveNowBanner = ({ avatars = [] }) => {
    const liveNow = useLiveStat({ min: 50, max: 200, step: 5, interval: 5000 });
    const countries = useLiveStat({ min: 50, max: 100, step: 2, interval: 7000 });
    const continents = useLiveStat({ min: 2, max: 5, step: 1, interval: 30000 });
    const [conversations] = useState(() => randInRange(100, 150));
    const [meetings] = useState(() => randInRange(50, 100));
    const [connections] = useState(() => randInRange(1000, 2000));

    const AVATAR_COUNT = 3;
    const [avatarOffset, setAvatarOffset] = useState(0);

    useEffect(() => {
        if (avatars.length <= AVATAR_COUNT) return;
        const id = setInterval(() => {
            setAvatarOffset((prev) => (prev + 1) % avatars.length);
        }, 3000);
        return () => clearInterval(id);
    }, [avatars]);

    const shownAvatars = avatars.length > 0
        ? Array.from({ length: AVATAR_COUNT }, (_, i) => avatars[(avatarOffset + i) % avatars.length])
        : [];
    const remainder = Math.max(0, liveNow - AVATAR_COUNT);

    const stats = [
        {
            icon: null,
            isLive: true,
        },
        {
            icon: <FiGlobe className="live-now-banner__icon" />,
            value: countries,
            label: "Countries Active",
            subtitle: <>Across <span className="live-now-banner__subtitle-highlight">{continents}</span> continents</>,
        },
        {
            icon: <FiMessageSquare className="live-now-banner__icon" />,
            value: conversations,
            label: "Live Conversations",
            subtitle: "Started Today",
            hasAvatars: true,
        },
        {
            icon: <FiCalendar className="live-now-banner__icon" />,
            value: meetings,
            label: "Meeting Schedule",
            subtitle: "Today",
        },
        {
            icon: <FiUsers className="live-now-banner__icon" />,
            value: connections,
            label: "Business Connections",
            subtitle: "Made this week",
        },
    ];

    return (
        <section className="live-now-banner mt-5 mb-5">
            <div className="container">
                <div className="live-now-banner__grid">
                    {stats.map((stat, index) =>
                        stat.isLive ? (
                            <div key={index} className="live-now-banner__card live-now-banner__card--live">
                                <div className="live-now-banner__live-inner">
                                    <div className="live-now-banner__live-left">
                                        <div className="live-now-banner__live-badge">
                                            <span className="live-now-banner__live-dot" />
                                            <span className="live-now-banner__live-text">Live Now</span>
                                        </div>
                                        <span className="live-now-banner__value">{liveNow}</span>
                                        <span className="live-now-banner__label">Professionals Online</span>
                                    </div>
                                    <div className="live-now-banner__avatars">
                                        {shownAvatars.map((a, i) => (
                                            <Image
                                                key={a.Id ?? i}
                                                src={a.ImageUrl || "/images/personExample.jpg"}
                                                alt={a.FullName || ""}
                                                width={38}
                                                height={38}
                                                className="live-now-banner__avatar"
                                            />
                                        ))}
                                        {remainder > 0 && (
                                            <span className="live-now-banner__avatar-rest">+{remainder}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div key={index} className="live-now-banner__card live-now-banner__card--stat">
                                <div className="live-now-banner__icon-wrap">
                                    {stat.icon}
                                </div>
                                <div className="live-now-banner__stat-right">
                                    <span className="live-now-banner__value">{stat.value}</span>
                                    <span className="live-now-banner__label">{stat.label}</span>
                                    {stat.subtitle && (
                                        <span className="live-now-banner__subtitle">{stat.subtitle}</span>
                                    )}
                                </div>
                                {stat.hasAvatars && (
                                    <div className="live-now-banner__avatars live-now-banner__avatars--vertical">
                                        {avatars.slice(0, 2).map((a, i) => (
                                            <Image
                                                key={a.Id ?? i}
                                                src={a.ImageUrl || "/images/personExample.jpg"}
                                                alt={a.FullName || ""}
                                                width={32}
                                                height={32}
                                                className="live-now-banner__avatar"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default LiveNowBanner;