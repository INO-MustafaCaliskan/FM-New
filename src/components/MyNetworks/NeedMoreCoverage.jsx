import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { BsGlobe } from 'react-icons/bs';
import './need-more-coverage.css';

const coverageCountries = [
  { id: 1, name: 'Brazil', flag: 'br', demand: 'High demand' },
  { id: 2, name: 'South Africa', flag: 'za', demand: 'High demand' },
  { id: 3, name: 'Mexico', flag: 'mx', demand: 'High demand' },
];

const NeedMoreCoverage = () => {
  return (
    <Card className="my-networks-list-card w-100 sidebar-card-wrapper">
      <Card.Body className="p-3">
        <div className="d-flex align-items-center mb-1">
          <BsGlobe size={20} className="me-2 text-dark" />
          <h6 className="sidebar-card-title fw-bold mb-0 fs-6">Need More Coverage?</h6>
        </div>
        <p className="text-muted mb-4" style={{ fontSize: '12px' }}>Connect in key markets to grow your global reach.</p>

        <Row className="g-2">
          {coverageCountries.map((country) => (
            <Col xs={4} key={country.id}>
              <div className="coverage-subcard d-flex flex-column align-items-center justify-content-between p-1 py-2 h-100 text-center">
                <img 
                  src={`https://flagcdn.com/w40/${country.flag}.png`} 
                  alt={country.name} 
                  className="rounded-circle mb-1 shadow-sm"
                  style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                />
                <div className="fw-bold text-dark mb-1 lh-sm w-100" style={{ fontSize: '10.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{country.name}</div>
                <div className="text-muted mb-2 lh-1 w-100" style={{ fontSize: '9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{country.demand}</div>
                <Button variant="outline-primary" size="sm" className="coverage-btn w-100 text-nowrap px-0 mt-auto" style={{ fontSize: '9px', padding: '0.2rem 0' }}>
                  Find Partners
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default NeedMoreCoverage;
