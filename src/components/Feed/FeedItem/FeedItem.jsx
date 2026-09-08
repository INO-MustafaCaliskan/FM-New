import React from 'react'
import useFeed from '@/context/FeedContext';
import { FeedItemHeader } from './FeedItemHeader';
import { FeedItemContent } from './FeedItemContent';
import { FeedInfo } from './FeedInfo';
import { FeedInteractions } from './FeedInteractions';
import styles from './FeedItem.module.css';
import FeedMediaShowcase from './FeedMediaShowcase';

const FeedItem = ({feed}) => {
    const { showOnPopUp, setEditingFeed, closePopUp } = useFeed(state => state);

    const handleEdit = async() => {
        closePopUp();
        setTimeout(async () => {
            await setEditingFeed(null, feed);
        }, 200);
    }

    const showPopup = async(carouselStartIndex = 0) => {
        await showOnPopUp(feed.id, feed, false, carouselStartIndex)
    }
  return (
    <div className={`d-flex flex-column mb-4 p-3 bg-white rounded ${styles.feed_item}`}>
        <FeedItemHeader 
            feedId={feed.id} 
            slug={feed.user.slug}
            createdDate={feed.createdDate}
            userImageUrl={feed.user.imageUrl} 
            userFullName={feed.user.fullName} 
            companyName={feed.user.companyName ?? "Company Name"} 
            isOwnFeed={feed.isOwnFeed}
            onEdit={handleEdit} />

        <FeedItemContent content={feed.content} />
        <FeedMediaShowcase medias={feed.medias} showPopup={showPopup} />
        <FeedInfo onClickComment={() => showPopup(0)} likeCount={feed.likeCount} commentCount={feed.commentCount} createdDate={feed.createdDate} feedId={feed.id} isUserLiked={feed.isUserLiked} />
        <FeedInteractions isUserLiked={feed.isUserLiked} feedId={feed.id} onClickComment={showPopup} />
    </div>
  )
}

export default FeedItem