import React from 'react';
import { Card } from 'react-bootstrap';
import { BsGraphUp, BsPeopleFill, BsGlobe, BsPersonFill, BsSend } from 'react-icons/bs';
import './recent-network-growth.css';

const growthEvents = [
  {
    id: 1,
    icon: <BsPeopleFill size={16} />,
    iconClass: 'growth-icon-green',
    title: '2 invitations accepted',
    date: 'Today, 10:24 AM'
  },
  {
    id: 2,
    icon: <BsGlobe size={16} />,
    iconClass: 'growth-icon-orange',
    title: 'Your network expanded to Germany',
    date: 'Yesterday, 3:45 PM'
  },
  {
    id: 3,
    icon: <BsPersonFill size={18} />,
    iconClass: 'growth-icon-green-light',
    title: 'John Smith joined your network',
    date: 'May 10, 2025'
  },
  {
    id: 4,
    icon: <BsSend size={16} />,
    iconClass: 'growth-icon-blue',
    title: '3 pending invitations',
    date: 'May 9, 2025'
  }
];

const RecentNetworkGrowth = () => {
  return (
    <Card className="my-networks-list-card w-100 sidebar-card-wrapper">
      <Card.Body className="p-3">
        <div className="d-flex align-items-center mb-4">
          <BsGraphUp size={20} className="me-2 text-dark" />
          <h6 className="sidebar-card-title fw-bold mb-0 fs-6">Recent Network Growth</h6>
        </div>

        <div className="growth-items-container">
          {growthEvents.map((event, index) => (
            <div 
              key={event.id} 
              className={`growth-item d-flex align-items-center py-2 ${index !== growthEvents.length - 1 ? 'border-bottom' : ''}`}
            >
              <div className={`growth-icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3 ${event.iconClass}`}>
                {event.icon}
              </div>
              <div>
                <div className="fw-bold text-dark" style={{ fontSize: '12px' }}>{event.title}</div>
                <div className="text-muted" style={{ fontSize: '10px' }}>{event.date}</div>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default RecentNetworkGrowth;
