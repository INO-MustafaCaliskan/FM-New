
"use client";
import { useState } from 'react';
import { FiUserPlus, FiPackage, FiCalendar, FiLink, FiTruck, FiAnchor } from 'react-icons/fi';
import './LiveActivity.css';

const COMPANIES = [
    'ABC Logistics', 'FastCargo', 'GlobalFreight', 'NordShip', 'EastWest Trade',
    'BlueSea Logistics', 'AlphaFreight', 'SkyBridge Co.', 'OceanLink', 'PrimeCargo',
];

const CITIES = [
    'Dubai', 'Rotterdam', 'Hamburg', 'Shanghai', 'Singapore',
    'Istanbul', 'Amsterdam', 'New York', 'London', 'Tokyo',
];

const COUNTRIES = [
    'Germany', 'Turkey', 'Singapore', 'Netherlands', 'United Arab Emirates',
    'United Kingdom', 'France', 'Poland', 'Spain', 'Japan',
];

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randMin() {
    return Math.floor(Math.random() * 20) + 1;
}

const CARD_POOL = [
    {
        icon: FiUserPlus,
        render: () => {
            const company = pick(COMPANIES);
            const country = pick(COUNTRIES);
            return { text: <><strong>{company}</strong> joined from <strong>{country}</strong></> };
        },
    },
    {
        icon: FiPackage,
        render: () => {
            const city = pick(CITIES);
            return { text: <>New freight inquiry from <strong>{city}</strong></> };
        },
    },
    {
        icon: FiCalendar,
        render: () => {
            const city = pick(CITIES);
            return { text: <>Meeting request sent from <strong>{city}</strong></> };
        },
    },
    {
        icon: FiAnchor,
        render: () => {
            const company = pick(COMPANIES);
            const country = pick(COUNTRIES);
            return { text: <><strong>{company}</strong> connected with a partner in <strong>{country}</strong></> };
        },
    },
    {
        icon: FiTruck,
        render: () => {
            const country = pick(COUNTRIES);
            return { text: <>New supplier joined from <strong>{country}</strong></> };
        },
    },
];

function generateSortedMinutes(count, min = 1, max = 20) {
    const nums = new Set();
    while (nums.size < count) nums.add(Math.floor(Math.random() * (max - min + 1)) + min);
    return [...nums].sort((a, b) => a - b);
}

const LiveActivity = ({ title }) => {
    const [cards] = useState(() => {
        const minutes = generateSortedMinutes(5);
        return minutes.map((minAgo, i) => {
            const template = pick(CARD_POOL);
            const { text } = template.render();
            return { id: i + 1, icon: template.icon, text, minAgo };
        });
    });

    return (
        <div className='mt-5 mb-5'>
            <div className='container'>
                {title && <h2 className="title-primary mb-5 mt-5">{title}</h2>}
                <div className="live-activity__grid">
                    {/* Card 1 – Header */}
                    <div className="live-activity__card live-activity__card--header">
                        <span className="live-activity__pulse" />
                        <span className="live-activity__header-title">
                            <span className="live-activity__header-label">Live</span> ACTIVITY
                        </span>
                    </div>

                    {/* Cards 2-6 */}
                    {cards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.id} className="live-activity__card">
                                <div className="live-activity__icon-wrap">
                                    <Icon size={26} color="#E65100" />
                                </div>
                                <div className="live-activity__info">
                                    <span className="live-activity__text">{card.text}</span>
                                    <span className="live-activity__time">{card.minAgo} min ago</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LiveActivity;