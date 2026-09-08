'use client';

import React, { useState } from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { BiEnvelope, BiSend } from 'react-icons/bi';
import InoButton from "@/components/Buttons/InoButton";
import client from '@/utils/client';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReferralSuccessModal from '@/components/ReferralSuccessModal/ReferralSuccessModal';
import './my-networks-list.css';

const MySwal = withReactContent(Swal);

const GrowYourNetwork = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successModalShow, setSuccessModalShow] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return;

    setIsLoading(true);
    const payload = {
      Email: formData.email,
      FirstName: formData.firstName,
      LastName: formData.lastName,
    };

    try {
      await client.post('/Referral/Add', payload);

      setSuccessEmail(formData.email);
      setSuccessModalShow(true);

      setFormData({
        email: '',
        firstName: '',
        lastName: '',
      });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Something went wrong. Please try again.';

      if (errorMessage.includes('no-membership')) {
        MySwal.fire({
          icon: 'error',
          title: 'Your Membership Has Expired!',
          html: `
            <p style="text-align: justify;">
              To submit referrals and participate in the Freight Talk Refer a Friend Program, you must have an
              active membership. Renew your membership to continue enjoying member benefits and start
              earning referral rewards.
            </p>
          `,
          confirmButtonText: 'Renew Membership Now',
          confirmButtonColor: '#EF6C00',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/pricing/';
          }
        });
      } else if (errorMessage.includes('email-already-member')) {
        MySwal.fire({
          icon: 'error',
          title: 'Already a Freight Talk Member',
          html: `<p style="text-align: justify;">This professional is already a Freight Talk member. Please recommend another trusted professional from your contacts.</p>`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF6C00',
        });
      } else if (errorMessage.includes('already-added')) {
        MySwal.fire({
          icon: 'error',
          title: 'Referral Already Submitted',
          html: `<p style="text-align: justify;">This professional has already been invited through Freight Talk's Refer a Friend Program. Please recommend another trusted professional from your network.</p>`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF6C00',
        });
      } else if (errorMessage.includes('no-limit')) {
        MySwal.fire({
          icon: 'error',
          title: 'Referral Limit Reached',
          html: `<p style="text-align: justify;">You have reached your maximum referral limit of 250 invitations for this period. Please wait for your next referral cycle to submit more invitations.</p>`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF6C00',
        });
      } else {
        MySwal.fire({
          icon: 'error',
          html: `<p style="text-align: justify;">${errorMessage}</p>`,
          confirmButtonColor: '#EF6C00',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="my-networks-list-card w-100 mb-4">
        <Card.Body className="p-4">
          <h6 className="connections-title fw-bold mb-2 fs-6">Grow Your Network</h6>
          <p className="text-muted mb-4 small">Quickly invite contacts and start building valuable freight connections.</p>
          
          <Form onSubmit={handleSubmit}>
            <Row className="g-3 align-items-center">
              <Col xs={12} lg>
                <div className="search-wrapper position-relative w-100">
                  <BiEnvelope className="position-absolute text-muted" size={20} style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 4 }} />
                  <Form.Control 
                    type="email" 
                    placeholder="Email Address *" 
                    className="shadow-none filter-input ps-5 w-100" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required 
                  />
                </div>
              </Col>
              
              <Col xs={12} md={6} lg>
                <Form.Control 
                  type="text" 
                  placeholder="First Name (optional)" 
                  className="shadow-none filter-input w-100"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </Col>

              <Col xs={12} md={6} lg>
                <Form.Control 
                  type="text" 
                  placeholder="Last Name (optional)" 
                  className="shadow-none filter-input w-100"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </Col>

              <Col xs={12} lg="auto">
                <InoButton 
                  type="submit" 
                  isLoading={isLoading}
                  className="w-100 d-flex align-items-center justify-content-center text-nowrap" 
                  style={{ height: '44px', padding: '0 24px' }}
                >
                  <BiSend className="me-2" size={18} style={{ transform: 'rotate(-45deg)' }} /> 
                  Send Invitation
                </InoButton>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <ReferralSuccessModal
        show={successModalShow}
        onClose={() => setSuccessModalShow(false)}
        email={successEmail}
      />
    </>
  );
};

export default GrowYourNetwork;
