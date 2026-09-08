'use client'
import Modal from 'react-bootstrap/Modal';
import Image from 'next/image';
import { LuVideo } from "react-icons/lu";
import { LuMessageCircle, LuGlobe } from "react-icons/lu";
import { RiBarChartFill } from "react-icons/ri";
import './style.css'
export default function AuthRequiredModal({ show, onClose }) {
    return (
        <Modal show={show} onHide={onClose} size="xl" centered>
            <Modal.Header className='auth-modal-header' closeButton>
            </Modal.Header>

            <Modal.Body>
                <div className="d-flex justify-content-between">
                    <div className="d-flex flex-column justify-content-between gap-3 ">
                        <div>
                            <h2 className='auth-modal-title mt-4'>Start Real-Time</h2>
                            <h2 className='auth-modal-title auth-modal-title-alt'>Business Development</h2>
                            <hr className='auth-modal-hr mb-4' />
                            <p className='auth-modal-description '>Connect face-to-face with freight forwarders, <br></br><span>logistics and supply chain professionals</span> worldwide to discover new opportunities, share insights, and drive business forward.</p>
                        </div>
                        <div className="d-flex flex-column gap-3 mt-4 mb-4">
                            <div>
                                <a
                                    className="ino-button btn d-flex align-items-center justify-content-center auth-modal-sign-in-link"

                                    onClick={() => {
                                        window.location.href = '/sign-up';
                                    }}
                                >
                                    Start Your Free 7-Day Trial
                                </a>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <a

                                    onClick={() => {
                                        window.location.href = '/sign-up';
                                    }}
                                >
                                    Already a member? <span className='auth-modal-sign-in'>Sign In</span>
                                </a>
                            </div>
                        </div>

                    </div>
                    <div className="auth-modal-image-wrapper">
                        <Image src="/images/auth-modal.png" alt="auth-required" width={700} height={500} />
                    </div>
                </div>

            </Modal.Body>

            <Modal.Footer>
                {/* <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button> */}
                <div className="d-flex justify-content-between w-100 mb-4 mt-4 footer-cards-wrapper">
                    <div className='auth-modal-footer-card d-flex align-items-center gap-3'>
                        <LuVideo className='auth-modal-footer-card-icon auth-modal-green' />
                        <span className='auth-modal-footer-card-span'>One-to-one video Meetings</span>
                    </div>

                    <div className='auth-modal-footer-card d-flex align-items-center gap-3'>
                        <LuMessageCircle className='auth-modal-footer-card-icon auth-modal-blue' />
                        <span className='auth-modal-footer-card-span'>Real-time Conversations</span>
                    </div>
                    <div className='auth-modal-footer-card d-flex align-items-center gap-3'>
                        <LuGlobe className='auth-modal-footer-card-icon auth-modal-orange' />
                        <span className='auth-modal-footer-card-span'>Expand Your Global Network</span>
                    </div>
                    <div className='auth-modal-footer-card d-flex align-items-center gap-3'>
                        <RiBarChartFill className='auth-modal-footer-card-icon auth-modal-purple' />
                        <span className='auth-modal-footer-card-span'>Create Business Opportunities</span>
                    </div>
                </div>


            </Modal.Footer>
        </Modal>
    );
}