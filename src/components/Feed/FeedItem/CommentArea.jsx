import useFeed from "@/context/FeedContext";
import { CommentInput } from "./CommentInput";
import { FeedComment } from "./FeedComment";
import { GoCommentDiscussion } from "react-icons/go";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from './CommentArea.module.css';

export const CommentArea = ({ feedId }) => {
    const { addComment, editComment, getComments, deleteComment } = useFeed(state => state);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    
    const sendComment = async (htmlContent) => {
      const newComment = await addComment(feedId, htmlContent, null);
      if(newComment){
        setComments((prevComments) => [...prevComments, newComment]);
        return true;
      }
      
      toast.error("Failed to add comment. Please try again.");
      return false;
    }

    const handleEditComment = async(id, comment, replyingUserId) => {
      const updatedComment = await editComment(id, comment, replyingUserId);
      if(updatedComment){
        setComments((prevComments) => prevComments.map(c => c.id === id ? {...c, ...updatedComment} : c));
      }
      else{
        toast.error("Failed to update the comment. Please try again.");
      }
      
    }

    const handleDeleteComment = async(id) => {
      const result = await deleteComment(id);
      if(result.success)
        setComments((prevComments) => prevComments.filter(c => c.id !== id));
      else
        toast.error(result.message || "Failed to delete the comment. Please try again.");

      return result.success;
    }

    useEffect(() => {
      const fetchComments = async() => {
        const comments = await getComments(feedId);
        setComments(comments);
        setLoading(false);
      }

      fetchComments();
    }, [getComments, feedId])

  return (
    <div className="mt-3 comment-area">
      {
        loading
          ? <p className="text-center mx-3"><span className={`spinner-border ${styles.loading_spinner}`}></span></p>
          : comments && comments.length > 0 
              ? (
                comments.map(comment => <div className="mt-3" key={comment.id}><FeedComment handeUpdate={handleEditComment} handleDelete={handleDeleteComment} comment={comment} /></div>)
              ) 
              : <div className="text-center">
                  <div>
                    <GoCommentDiscussion size={48} className="text-secondary" />
                  </div>
                  <h3 className="text-secondary">No comments yet.</h3>
                  <p className="text-muted">Be the first to comment on this post.</p>
                </div>
      }
      <div className="mt-3">
        <CommentInput onSend={sendComment} />
      </div>
    </div>
  )
}
