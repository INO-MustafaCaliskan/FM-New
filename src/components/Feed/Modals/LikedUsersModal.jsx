import useFeed from '@/context/FeedContext'
import Image from 'next/image';
import React from 'react'
import { Modal } from 'react-bootstrap'
import styles from './LikedUsersModal.module.css';
import FeedAvatar from '../FeedAvatar';

export const LikedUsersModal = () => {
    const {showingLikes, closeLikes, likesLoading } = useFeed();

  return (
    <Modal animation={false} centered show={likesLoading || showingLikes} onHide={closeLikes} id="feed-liked-users-modal" size='md' className='feed-modal secondary-modal'>
        <Modal.Header>
            <div className='flex-grow-1'>
                <Modal.Title>Liked Users</Modal.Title>
            </div>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeLikes}></button>
        </Modal.Header>
        <Modal.Body>
            {
                likesLoading && <p className="text-center mx-3 text-muted"><span className="loading-spinner spinner-border"></span></p>
            }
            {
                !likesLoading && showingLikes?.length === 0 ? (
                    <p>No liked users.</p>
                ) : (
                    <ul className='list-unstyled'>
                        {
                            showingLikes?.map(likeData => (
                                <li key={likeData.user.id} className={`${styles.liked_user_item} d-flex align-items-center mb-3`}>
                                    <FeedAvatar imageUrl={likeData.user.imageUrl} altName={likeData.user.fullName} width={40} height={40} />
                                    <div className='d-flex flex-column ms-2'>
                                        <a title='View Profile' target='_blank' href={`/user-profile/${likeData.user.slug}`}><p className='mb-0'>{likeData.user.fullName}</p></a>
                                        <small className='text-muted'>{likeData.user.companyName}</small>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </Modal.Body>

    </Modal>
  )
}
