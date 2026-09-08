import Dropdown from 'react-bootstrap/Dropdown';
import { BiSolidEditAlt, BiSolidTrashAlt, BiDotsVerticalRounded } from "react-icons/bi";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import useFormatDate from '@/utils/hooks/useFormatDate';
import { CommentInput } from './CommentInput';
import FeedAvatar from '../FeedAvatar';
import styles from './FeedComment.module.css';
import FeedDropdown from '../Common/FeedDropdown';

export const FeedComment = ({comment, handeUpdate, handleDelete}) => {
    const formatDate = useFormatDate();
    const [processing, setProcessing] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const deleteHandler = async() => {
        setProcessing(true);
        const result = await handleDelete(comment.id);
        if(result)
            setDeleteModalShow(false);
        setProcessing(false);
    }

    const updateHandler = async (htmlContent) => {
        await handeUpdate(comment.id, htmlContent, null);
        setIsUpdateMode(false);
        return true;
    }

  return (
    <div className="d-flex flex-row align-items-start f-comment-item">
        <div>
            <FeedAvatar imageUrl={comment.replierUser.imageUrl} altName={comment.replierUser.fullName} width={40} height={40} />
        </div>
        <div className={`${isUpdateMode ? 'flex-grow-1' : ''} w-auto`}>
            {
                isUpdateMode 
                ? (
                    <div className='ms-2'>
                        <CommentInput isUpdate={true} updateContent={comment.comment} onUpdate={updateHandler} />
                        <button onClick={() => setIsUpdateMode(false)} className="btn btn-link ps-0">Cancel</button>
                    </div>
                )
                : (
                    <>
                        <div className={`ms-2 p-2 rounded ${styles.comment_content}`}>
                            <div className={styles.comment_user_full_name}>{comment.replierUser.fullName}</div>
                            <div className={styles.comment_text} dangerouslySetInnerHTML={{__html: comment.comment}}></div>
                        </div>
                        <div className={`ms-2 mt-1 ${styles.comment_date}`} title={new Date(comment.createdDate).toLocaleString()}>
                            {formatDate(comment.createdDate, false, true)}
                        </div>
                    </>
                )
            }

        </div>
        <div>
            {
                !isUpdateMode && comment.isOwnComment
                && (
                    <FeedDropdown items={[
                        {key: 'edit', label: <><BiSolidEditAlt /> Edit</>, onClick: () => setIsUpdateMode(true)},
                        {key: 'delete', label: <><BiSolidTrashAlt /> Delete</>, onClick: () => setDeleteModalShow(true)}
                    ]} />
                )
            }
        </div>

        <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)} style={{zIndex: 1055, backgroundColor : 'rgba(0,0,0,0.5)'}}>
            <Modal.Header>
                <Modal.Title>Delete Comment</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this comment? This action cannot be undone.</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeleteModalShow(false)}>
                Close
            </Button>
            <Button variant="danger" onClick={deleteHandler} disabled={processing}>
                {
                    processing ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Delete !'
                }
            </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}
