import React from 'react';
import { Card } from 'react-bootstrap';
import { 
  BsPerson, 
  BsClockHistory, 
  BsCalendar4Event, 
  BsStar, 
  BsHandbag,
  BsShieldFill,
  BsStarFill,
  BsCheckCircleFill,
  BsBook,
  BsChevronRight
} from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import Link from 'next/link';
import './blue-badge-journey.css';

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
    label: 'Profile', 
    icon: BsPerson, 
    statusValue: '100%',
    statusLabel: 'Completed', 
    isCompleted: true 
  },
  { 
    id: 2, 
    label: 'Account History', 
    icon: BsClockHistory, 
    statusValue: '67 / 90',
    statusLabel: 'Days', 
    isCompleted: false
  },
  { 
    id: 3, 
    label: 'Meetings', 
    icon: BsCalendar4Event, 
    statusValue: '7 / 10',
    statusLabel: 'Completed', 
    isCompleted: false
  },
  { 
    id: 4, 
    label: 'Reviews', 
    icon: BsStar, 
    statusValue: '1 Review',
    statusLabel: '(4★ or 5★)', 
    isCompleted: true 
  },
  { 
    id: 5, 
    label: 'Membership', 
    icon: BsHandbag, 
    statusValue: '1 Package',
    statusLabel: 'Purchased', 
    isCompleted: true 
  },
];

const CircularProgress = ({ percentage, size = 64, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bb-circular-progress" style={{ width: size, height: size }}>
      <svg>
        <circle
          className="bb-circular-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="bb-circular-bar"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="bb-circular-text">{percentage}%</div>
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
    <div className="bb-status-icon-pending">
      <svg>
        <circle
          className="bb-status-circle-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        {percentage > 0 && (
          <circle
            className="bb-status-circle-bar"
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

const BlueBadgeJourney = () => {
  return (
    <Card className="my-networks-list-card w-100 sidebar-card-wrapper">
      <Card.Body className="p-3">
        
        {/* Header */}
        <div className="d-flex align-items-center">
          <div className="bb-shield-icon-container me-3">
            <BsShieldFill size={32} />
            <BsStarFill className="bb-shield-star" />
          </div>
          <h6 className="bb-header-title mb-0 me-2 fs-6">Blue Badge Journey</h6>
          <MdVerified className="bb-verified-icon" />
        </div>

        {/* Progress Section */}
        <div className="bb-progress-container">
          <CircularProgress percentage={60} />
          <div className="bb-linear-progress-container">
            <div className="bb-linear-progress-text">3 of 5 requirements completed</div>
            <div className="bb-linear-progress-track">
              <div className="bb-linear-progress-fill" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        <div className="bb-divider"></div>

        {/* List Items */}
        <div className="bb-list-container">
          {journeyItems.map((item) => (
            <div key={item.id} className="bb-list-item">
              <div className="bb-list-item-left">
                <div className="bb-item-icon-wrapper">
                  <item.icon size={18} />
                </div>
                <span className="bb-item-title">{item.label}</span>
              </div>
              <div className="bb-list-item-right">
                <div className={`bb-item-status-container ${item.isCompleted ? 'bb-text-completed' : 'bb-text-pending'}`}>
                  <div className="bb-item-status-value">{item.statusValue}</div>
                  <div className="bb-item-status-label">{item.statusLabel}</div>
                </div>
                {item.isCompleted ? (
                  <BsCheckCircleFill className="bb-status-icon-completed" />
                ) : (
                  <MiniCircularProgress percentage={item.progressPercentage !== undefined ? item.progressPercentage : getProgressPercentage(item.statusValue)} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bb-footer">
          <Link href="/get-verified" className="bb-footer-link">
            <BsBook size={18} className="bb-footer-icon" />
            How to Get Verified?
            <BsChevronRight className="bb-footer-chevron" />
          </Link>
        </div>

      </Card.Body>
    </Card>
  );
};

export default BlueBadgeJourney;
