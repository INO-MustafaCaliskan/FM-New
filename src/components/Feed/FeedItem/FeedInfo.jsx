import useFeed from "@/context/FeedContext";
import useFormatDate from "@/utils/hooks/useFormatDate";
import { BiSolidHeart, BiSolidComment } from "react-icons/bi";
import styles from './FeedInfo.module.css'

export const FeedInfo = ({likeCount, commentCount, createdDate, feedId, onClickComment, isUserLiked}) => {
    const {showLikes} = useFeed();
    const formatDate = useFormatDate()
  return (
        <div className="d-flex flex-row justify-content-end align-items-center mt-3">
            <div className="d-flex flex-row">
                <a onClick={() => showLikes(feedId)} className={`${styles.info_item} ${isUserLiked ? styles.liked : ''}`} title="Show liked users">
                    {likeCount}
                    <span className='ms-1'><BiSolidHeart size={14} /></span>
                </a>
                
                <a onClick={onClickComment} className={`${styles.info_item} ms-2`} title="Show comments">
                    {commentCount}
                    <span className='ms-1'><BiSolidComment size={14} /></span>
                </a>
                
            </div>
        </div>
  )
}
