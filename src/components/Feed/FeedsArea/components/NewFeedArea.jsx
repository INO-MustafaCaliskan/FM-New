import { useUser } from '@/context/UserContext'
import React from 'react'
import FeedAvatar from '../../FeedAvatar';
import styles from './NewFeedArea.module.css';

export const NewFeedArea = ({onClickArea}) => {
    const {user} = useUser();
  return (
        <div className={`bg-white p-3 rounded d-flex flex-row ${styles.wrapper}`}>
            <div>
                <FeedAvatar imageUrl={user?.imageUrl} altName={user?.firstName} priority={true} />
            </div>
            <div className={`d-flex align-items-center w-100 ms-3 px-3 ${styles.nf_input_area}`} onClick={onClickArea}>
                <p className='text-muted m-0'>What's on your mind?</p>
            </div>
        </div>
  )
}
