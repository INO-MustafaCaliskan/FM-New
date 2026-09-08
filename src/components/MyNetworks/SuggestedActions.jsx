import React from 'react';
import { Card } from 'react-bootstrap';
import { BsLightningCharge, BsStar, BsPeople, BsGlobe, BsChevronRight } from 'react-icons/bs';
import './suggested-actions.css';

const actionItems = [
  { 
    id: 1, 
    icon: <BsStar size={20} className="action-icon text-primary" />, 
    title: 'Connect with your favorites',
    subtitle: 'You have 6 favorites not yet connected'
  },
  { 
    id: 2, 
    icon: <BsPeople size={20} className="action-icon text-info" />, 
    title: 'Invite more partners',
    subtitle: '15 pending invitations'
  },
  { 
    id: 3, 
    icon: <img src="https://flagcdn.com/w20/br.png" width="20" alt="Brazil" className="action-flag-icon rounded-circle" />, 
    title: 'Expand to Brazil',
    subtitle: 'Find partners in high-demand markets'
  },
  { 
    id: 4, 
    icon: <BsPeople size={20} className="action-icon text-info" />, 
    title: 'Invite your team',
    subtitle: 'Add colleagues to grow your network'
  },
];

const SuggestedActions = () => {
  return (
    <Card className="my-networks-list-card w-100 sidebar-card-wrapper">
      <Card.Body className="p-3">
        <div className="d-flex align-items-center mb-4">
          <BsLightningCharge size={20} className="me-2 text-dark" />
          <h6 className="sidebar-card-title fw-bold mb-0 fs-6">Suggested Actions</h6>
        </div>

        <div className="action-items-container">
          {actionItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`action-item d-flex align-items-center p-3 ${index !== actionItems.length - 1 ? 'border-bottom' : ''}`}
            >
              <div className="me-3 d-flex align-items-center justify-content-center" style={{ width: '24px' }}>
                {item.icon}
              </div>
              <div className="flex-grow-1">
                <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{item.title}</div>
                <div className="text-muted" style={{ fontSize: '11px' }}>{item.subtitle}</div>
              </div>
              <BsChevronRight size={14} className="text-muted ms-2" />
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SuggestedActions;
