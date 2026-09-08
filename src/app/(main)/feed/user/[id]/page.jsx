'use client'
import FeedsArea from '@/components/Feed/FeedsArea/FeedsArea';
import InoBreadcrumb from '@/components/InoBreadcrumb/InoBreadcrumb';
import { useParams } from 'next/navigation';
import React from 'react'
import '../../feed.css'
import GeneralTitle from '@/components/Feed/Common/GeneralTitle';

const UserFeeds = () => {
    const { id } = useParams();
    const isMobile = window.innerWidth < 992;
    const pageTitle = id === 'me' ? "My Feeds" : "User's Feeds";
  return (
    <div className={`container ${isMobile ? 'w-100' : 'w-50'}`} id='feed-area'>
        <InoBreadcrumb linkName={pageTitle} subRoots={[{href: "/feed", name: "Feed"}]} id="feed-breadcrumb" />
        <GeneralTitle title={pageTitle} id="feed-user-page-title" />
        <FeedsArea onlyUserFeeds={id === 'me'} userId={id !== 'me' ? id : null} showNewFeedArea={false} />
    </div>
  )
}

export default UserFeeds