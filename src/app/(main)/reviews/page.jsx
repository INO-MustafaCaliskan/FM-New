'use client'
import { Card } from 'react-bootstrap'
import './style.css'
import InoBreadcrumb from '@/components/InoBreadcrumb/InoBreadcrumb'
import { LuMessageCircleMore } from "react-icons/lu";
import NetworkersTab from '@/components/GlobalNetworkers/NetworkersTab';
import { LuSearch } from "react-icons/lu";
import LatestReviewCard from '@/components/LatestReviewCard/LatestReviewCard';
const page = () => {
    return (
        <>
            <div className='container'>
                <InoBreadcrumb linkName="Reviews" />

                <Card className=' reviews-card'>
                    <div className=' mt-3 reviews-content d-flex flex-column  align-items-center justify-content-center text-center'>
                        <div>
                            <h2>Trusted by Professionals.</h2>
                            <h2>Driven by Real Experiences.</h2>
                        </div>
                        <div>
                            <p className='mt-3'>
                                Explore reviews from freight forwarders, logistics and supply chain professionals.
                            </p>
                        </div>
                        <div>
                            <p className=''>
                                Their experiences help you connect with the right partners with confidence.
                            </p>
                        </div>
                        <div className='review-list-search ' >
                            <LuSearch className='review-list-search-icon' />
                            <input type="text" placeholder='Search by name, company, country or Freight Talk ID' className='review-list-search-input' />
                        </div>
                        <div className='reviews-content-information d-flex w-75 justify-content-between align-items-center mt-4'>
                            <div className='reviews-content-information-icon d-flex align-items-center justify-content-center'>
                                <LuMessageCircleMore className='reviews-content-information-icon-format' />
                            </div>
                            <div className='reviews-content-information-description d-flex flex-column align-items-start justify-content-center'>
                                <p className='reviews-content-information-top '>Share your experience and help the community grow.</p>
                                <p className='reviews-content-information-bottom'>Your review can help another professional find the right partner.</p>
                            </div>
                            <div className='reviews-content-information-buttons d-flex flex-column align-items-center justify-content-center'>
                                <button
                                    onClick={() => window.location.href = '/sign-up'} className='reviews-content-information-buttons-write btn ino-button'>Sign Up Write a Review</button>
                                <p>Already a member? <span
                                    onClick={() => window.location.href = '/sign-in'} className='review-span'> Sign In</span></p>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                    <div className='latest-reviews-container d-flex flex-column align-items-center justify-content-center'>
                        <div className='latest-reviews-header d-flex flex-column justify-content-center align-items-center w-100 mt-5'>
                            <div>
                                <h2>Latest Reviews</h2>
                            </div>
                            <div className='latest-reviews-list d-flex flex-wrap gap-4'>
                                <LatestReviewCard />
                                <LatestReviewCard />
                                <LatestReviewCard />
                                <LatestReviewCard />
                                <LatestReviewCard />
                                <LatestReviewCard />
                                <LatestReviewCard />
                                <LatestReviewCard />
                            </div>

                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default page