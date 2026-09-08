import React from 'react'
import { FeedItemHeader } from '../FeedItem/FeedItemHeader'
import { FeedItemContent } from '../FeedItem/FeedItemContent'
import { FeedInfo } from '../FeedItem/FeedInfo'
import { FeedInteractions } from '../FeedItem/FeedInteractions'
import { CommentArea } from '../FeedItem/CommentArea'
import { ImageViewer } from '../FeedItem/ImageViewer'
import useFeed from '@/context/FeedContext'
import { Modal } from 'react-bootstrap'

export const PopUpFeedModal = ({popUpFeed}) => {
    const isMobile = window.innerWidth < 992;
    const { setEditingFeed, closePopUp, showOnPopUp } = useFeed(state => state);
    const handleEdit = async() => {
        closePopUp();
        setTimeout(async () => {
            await setEditingFeed(null, popUpFeed);
        }, 200);
    }

    const openPopUp = async() => {
        await showOnPopUp(null, popUpFeed, false, 0);
    }

  return (
        <Modal id="feed-detail-modal" fullscreen={isMobile} className='feed-modal' scrollable centered size={popUpFeed?.medias?.length > 0 ? 'xl' : 'lg'}  animation={false} show={popUpFeed !== null} onHide={closePopUp}>
            <Modal.Header>
                <div className='flex-grow-1'>
                    <h5 className="modal-title">{popUpFeed?.user?.fullName}'s Post</h5>
                </div>
                <button type="button" className="btn-close" aria-label="Close" onClick={closePopUp}></button>
            </Modal.Header>
            <Modal.Body className='overflow-auto'>
                <div className='row'>
                    <div className="col-12">
                        <FeedItemHeader 
                            feedId={popUpFeed.id} 
                            slug={popUpFeed.user.slug}
                            createdDate={popUpFeed.createdDate}
                            userImageUrl={popUpFeed.user.imageUrl} 
                            userFullName={popUpFeed.user.fullName} 
                            companyName={popUpFeed.user.companyName ?? "Company Name"} 
                            isOwnFeed={popUpFeed.isOwnFeed}
                            onEdit={handleEdit} />
                        <FeedItemContent content={popUpFeed.content} />
                        {   popUpFeed.medias && popUpFeed.medias.length > 0 &&
                                <ImageViewer medias={popUpFeed.medias} carouselStartIndex={popUpFeed.carouselStartIndex} />
                        }
                        <FeedInfo onClickComment={openPopUp} likeCount={popUpFeed.likeCount} commentCount={popUpFeed.commentCount} createdDate={popUpFeed.createdDate} feedId={popUpFeed.id} isUserLiked={popUpFeed.isUserLiked} />
                        <FeedInteractions isUserLiked={popUpFeed.isUserLiked} feedId={popUpFeed.id} onClickComment={() => {}} />
                        <CommentArea feedId={popUpFeed.id} comments={popUpFeed.comments} />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
  )
}

export default PopUpFeedModal;