import React from 'react';
import { Card } from 'react-bootstrap';
import { 
  BsClockHistory, 
  BsCalendar4Event, 
  BsStar, 
  BsShieldFill,
  BsStarFill,
  BsCheckCircleFill,
  BsBook,
  BsChevronRight,
  BsGlobe
} from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import Link from 'next/link';
import './orange-badge-journey.css';

const getProgressPercentage = (valueStr) => {
  if (!valueStr || !valueStr.includes('/')) return 0;
  const parts = valueStr.split('/');
  if (parts.length === 2) {
    const current = parseFloat(parts[0]);
    const total = parseFloat(parts[1]);
    if (!isNaN(current) && !isNaN(total) && total > 0) {
      return Math.round((current / total) * 100);
    }
  }
  return 0;
};

const journeyItems = [
  { 
    id: 1, 
    label: 'Meetings', 
    icon: BsCalendar4Event, 
    statusValue: '50 / 50',
    statusLabel: 'Completed', 
    isCompleted: true 
  },
  { 
    id: 2, 
    label: 'Reviews', 
    icon: BsStar, 
    statusValue: '3 / 5',
    statusLabel: 'Reviews', 
    isCompleted: false
  },
  { 
    id: 3, 
    label: 'Country Connections', 
    icon: BsGlobe, 
    statusValue: '3 / 3',
    statusLabel: 'Countries', 
    isCompleted: true
  },
  { 
    id: 4, 
    label: 'Recent Activity', 
    icon: BsClockHistory, 
    statusValue: '7 / 10 Meetings',
    statusLabel: '(Last 180 Days)', 
    isCompleted: false
  },
];

const CircularProgress = ({ percentage, size = 64, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="ob-circular-progress" style={{ width: size, height: size }}>
      <svg>
        <circle
          className="ob-circular-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="ob-circular-bar"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="ob-circular-text">{percentage}%</div>
    </div>
  );
};

const MiniCircularProgress = ({ percentage }) => {
  const size = 20;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="ob-status-icon-pending">
      <svg>
        <circle
          className="ob-status-circle-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        {percentage > 0 && (
          <circle
            className="ob-status-circle-bar"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        )}
      </svg>
    </div>
  );
};

const OrangeBadgeJourney = () => {
  return (
    <Card className="my-networks-list-card w-100 sidebar-card-wrapper">
      <Card.Body className="p-3">
        
        {/* Header */}
        <div className="d-flex align-items-center flex-wrap position-relative">
          <div className="ob-shield-icon-container me-3">
            <BsShieldFill size={32} />
            <BsStarFill className="ob-shield-star" />
          </div>
          <h6 className="ob-header-title mb-0 me-2 fs-6">Orange Badge Journey</h6>
          <MdVerified className="ob-verified-icon" />
          
          <div className="w-100">
             <div className="ob-badge-holder-pill">
                <BsCheckCircleFill /> Blue Badge Holder
             </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="ob-progress-container">
          <CircularProgress percentage={50} />
          <div className="ob-linear-progress-container">
            <div className="ob-linear-progress-text">2 of 4 requirements completed</div>
            <div className="ob-linear-progress-track">
              <div className="ob-linear-progress-fill" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>

        <div className="ob-divider"></div>

        {/* List Items */}
        <div className="ob-list-container">
          {journeyItems.map((item) => (
            <div key={item.id} className="ob-list-item">
              <div className="ob-list-item-left">
                <div className="ob-item-icon-wrapper">
                  <item.icon size={18} />
                </div>
                <span className="ob-item-title">{item.label}</span>
              </div>
              <div className="ob-list-item-right">
                <div className={`ob-item-status-container ${item.isCompleted ? 'ob-text-completed' : 'ob-text-pending'}`}>
                  <div className="ob-item-status-value">{item.statusValue}</div>
                  <div className="ob-item-status-label">{item.statusLabel}</div>
                </div>
                {item.isCompleted ? (
                  <BsCheckCircleFill className="ob-status-icon-completed" />
                ) : (
                  <MiniCircularProgress percentage={item.progressPercentage !== undefined ? item.progressPercentage : getProgressPercentage(item.statusValue)} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="ob-footer">
          <Link href="/get-verified" className="ob-footer-link">
            <BsBook size={18} className="ob-footer-icon" />
            How to Get Verified?
            <BsChevronRight className="ob-footer-chevron" />
          </Link>
        </div>

      </Card.Body>
    </Card>
  );
};

export default OrangeBadgeJourney;
