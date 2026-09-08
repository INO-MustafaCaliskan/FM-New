// FeedInteractions.jsx
import useFeed from "@/context/FeedContext";
import { BiSolidHeart, BiSolidComment } from "react-icons/bi";
import styles from './FeedInteractions.module.css';

export const FeedInteractions = ({ isUserLiked, feedId, onClickComment }) => {
  const { toggleLike } = useFeed(state => state);
  return (
    <div className={styles.interaction_area}>
      <button
        className={`${styles.btn} ${isUserLiked ? styles.liked : styles.neutral}`}
        onClick={() => toggleLike(feedId, isUserLiked)}
      >
        <BiSolidHeart size={16} />
        <span>{isUserLiked ? 'Liked' : 'Like'}</span>
      </button>

      <button
        className={`${styles.btn} ${styles.neutral}`}
        onClick={() => onClickComment(0)}
      >
        <BiSolidComment size={16} />
        <span>Comment</span>
      </button>
    </div>
  )
}