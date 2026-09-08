import React, { useState, useEffect } from 'react';
import { Row, Col, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import { BiInfoCircle } from 'react-icons/bi';
import { BsPeopleFill } from 'react-icons/bs';
import { TbWorld } from 'react-icons/tb'; // Using TbWorld for globe
import { AiFillCaretUp } from 'react-icons/ai';
import client from '@/utils/client';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import './network-stats.css';

countries.registerLocale(en);

const getFlagUrl = (flagCode) => {
  if (!flagCode) return '';
  if (flagCode.toUpperCase() === 'TRNC') return '/images/north-cyprus.png';
  return `https://flagcdn.com/w20/${flagCode.toLowerCase().slice(0, 2)}.png`;
};

const NetworkStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await client.get('/NetworkConnection/UserNetworkInsights');
        if (response.data && response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch user network insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const connectionCount = stats?.connectionCount ?? 0;
  const thisMonthConnections = stats?.thisMonthConnections ?? 0;
  const countryCount = stats?.countryCount ?? 0;
  const thisMonthCountries = stats?.thisMonthCountries ?? 0;
  const topCountries = stats?.topCountries ?? [];

  const maxCount = topCountries.length > 0 
    ? Math.max(...topCountries.map(c => c.connectionCount ?? 0)) 
    : 1;

  return (
    <div className="network-stats-wrapper">
      <Row className="g-3">
        {/* Left Column for the two stat cards */}
        <Col xs={12} lg={4} className="d-flex flex-column gap-3 network-stat-col">
          {/* Connections Card */}
          <div className="network-stat-card">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center w-100 py-4">
                <Spinner animation="border" className="text-success" />
              </div>
            ) : (
              <>
                <div className="network-stat-icon-wrapper connections-icon">
                  <BsPeopleFill size={32} />
                </div>
                <div className="network-stat-details">
                  <div className="network-stat-header">
                    Connections 
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-connections" className="custom-tooltip">Total number of connections in your network</Tooltip>}
                    >
                      <span className="d-inline-flex">
                        <BiInfoCircle className="network-stat-info-icon" size={14} />
                      </span>
                    </OverlayTrigger>
                  </div>
                  {(!stats || connectionCount === 0) ? (
                    <div className="text-muted small mt-1 fw-medium">No data available</div>
                  ) : (
                    <>
                      <div className="network-stat-number">{connectionCount}</div>
                      <div className="network-stat-trend">
                        <AiFillCaretUp /> {thisMonthConnections} this month
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Countries Card */}
          <div className="network-stat-card">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center w-100 py-4">
                <Spinner animation="border" className="text-success" />
              </div>
            ) : (
              <>
                <div className="network-stat-icon-wrapper countries-icon">
                  <TbWorld size={36} />
                </div>
                <div className="network-stat-details">
                  <div className="network-stat-header">
                    Countries 
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-countries" className="custom-tooltip">Total number of countries in your network</Tooltip>}
                    >
                      <span className="d-inline-flex">
                        <BiInfoCircle className="network-stat-info-icon" size={14} />
                      </span>
                    </OverlayTrigger>
                  </div>
                  {(!stats || countryCount === 0) ? (
                    <div className="text-muted small mt-1 fw-medium">No data available</div>
                  ) : (
                    <>
                      <div className="network-stat-number">{countryCount}</div>
                      <div className="network-stat-trend">
                        <AiFillCaretUp /> {thisMonthCountries} this month
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </Col>

        {/* Right Column for Top Countries Chart */}
        <Col xs={12} lg={8}>
          <div className="top-countries-card">
            <div className="top-countries-title">Top Countries in Your Network</div>
            
            <div className="country-stats-list">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                  <Spinner animation="border" className="text-success" />
                </div>
              ) : (!stats || topCountries.length === 0) ? (
                <div className="text-center py-5 text-muted small">
                  No data available.
                </div>
              ) : (
                topCountries.map((country, index) => {
                  const count = country.connectionCount ?? 0;
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  
                  let flagCode = country.countryCode;
                  if (!flagCode || (flagCode.length !== 2 && flagCode.toUpperCase() !== 'TRNC')) {
                    const derived = countries.getAlpha2Code(country.name || '', 'en');
                    if (derived) {
                      flagCode = derived;
                    }
                  }
                  
                  const flagUrl = getFlagUrl(flagCode);

                  return (
                    <div key={index} className="country-stat-row">
                      <div className="country-flag">
                        {flagUrl ? (
                          <img src={flagUrl} alt={country.name || ''} width="20" />
                        ) : country.flag ? (
                          <span style={{ fontSize: '18px', lineHeight: '15px' }}>{country.flag}</span>
                        ) : (
                          <div style={{ width: 20, height: 15, backgroundColor: '#eee', display: 'inline-block' }}></div>
                        )}
                      </div>
                      <div className="country-name" title={country.name}>{country.name || 'Unknown'}</div>
                      <div className="country-progress-wrapper">
                        <div 
                          className="country-progress-bar" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="country-count">{count}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default NetworkStats;
