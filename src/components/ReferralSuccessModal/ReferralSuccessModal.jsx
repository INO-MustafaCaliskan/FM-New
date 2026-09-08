'use client'
import Modal from 'react-bootstrap/Modal';

import './style.css'
import Image from 'next/image';
import { LuCheck, LuGift } from "react-icons/lu";
export default function ReferralSuccessModal({ show, onClose, email }) {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton className="referral-success-modal-header d-flex align-items-center justify-content-end">
            </Modal.Header>
            <Modal.Body>
                <div className="text-center referral-success-content">
                    <div className="referral-success-icon mb-3">
                        <Image src="/images/referral-success-modal.png"
                            alt="Referral Success Icon"
                            width={450}
                            height={200}
                        />
                    </div>
                    <div className="d-flex align-items-center justify-content-center mb-3 gap-3">
                        <LuCheck className='referral-modal-check-icon' />
                        <h2 className="fw-bold mb-2">Invitation Sent</h2>
                    </div>

                    <p className="mb-3 text-muted">
                        Your invitation has been sent to <br />
                        <span className="fw-semibold referral-modal-email-text">[{email}].</span>
                    </p>
                    <hr className="my-3 referral-success-modal-hr" />
                    <div className="referral-success-message p-3 rounded mb-4 " >
                        <p className="mb-0 text-dark">
                            Don't stop now. Every new member who joins Freight Talk through your invitation earns you <span>10 days</span> of free membership.
                        </p>



                        <div className="d-flex justify-content-center" >
                            <div className="referral-success-message-info d-flex align-items-center justify-content-center p-3 rounded mt-3 col-10" >
                                <LuGift className='referral-modal-success-icon col-3' />
                                <div className="referral-success-message-text ms-3 d-flex align-items-start flex-column col-9 mt-3">
                                    <p className='referral-success-message-text-top'>The more professionals you invite, </p>
                                    <p className='referral-success-message-text-bottom'>the more rewards you earn.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="btn ino-button w-100"
                    >
                        OK
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
}
