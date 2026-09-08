import React from 'react'
import { FeedItemHeader } from './FeedItemHeader'
import { FeedItemContent } from './FeedItemContent';
import { ImageViewer } from './ImageViewer';
import { FeedInfo } from './FeedInfo';
import { FeedInteractions } from './FeedInteractions';
import { CommentArea } from './CommentArea';
import { LikedUsersModal } from "@/components/Feed/Modals/LikedUsersModal";
import { FeedCrudModal } from "@/components/Feed/Modals/FeedCrudModal";
import useFeed from '@/context/FeedContext';

const DetailedFeedItem = ({feed, onBeforeEditing}) => {
    const { setEditingFeed, editingFeed, closeEditingFeed} = useFeed();

    const handleEdit = async() => {
        if (onBeforeEditing) {
            onBeforeEditing();
        }
        setTimeout(async () => {
            await setEditingFeed(null, feed);
        }, 200);
    }

  return (
    <div className="d-flex flex-column mb-4 p-3 bg-white rounded feed-item">
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

        {   feed.medias && feed.medias.length > 0 &&
                <ImageViewer medias={feed.medias} carouselStartIndex={feed.carouselStartIndex} />
        }

        <FeedInfo onClickComment={() => {}} likeCount={feed.likeCount} commentCount={feed.commentCount} createdDate={feed.createdDate} feedId={feed.id} isUserLiked={feed.isUserLiked} />
        <FeedInteractions isUserLiked={feed.isUserLiked} feedId={feed.id} onClickComment={() => {}} />
        <CommentArea feedId={feed.id} comments={feed.comments} />


        {editingFeed && <FeedCrudModal 
                isShow={editingFeed}
                onHide={() => {
                    closeEditingFeed();
                }} 
                mode="edit"
                updatingFeed={editingFeed} 
            />
        }
        <LikedUsersModal />
    </div>
  )
}

export default DetailedFeedItem