import React, { useRef, useState, useCallback } from 'react'
import { Modal } from 'react-bootstrap'
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $getRoot, $getSelection } from 'lexical';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import styles from './FeedCrudModal.module.css';
import useFeed from '@/context/FeedContext';
import { BiImageAdd } from 'react-icons/bi';
import { useUser } from '@/context/UserContext';
import FeedAvatar from '../FeedAvatar';
import { EmojiSelect } from '@/components/UI/EmojiSelect';
import { EmojiNode, $createEmojiNode } from '@/components/Feed/Editor/CustomNodes/EmojiNode';
import EditorRefPlugin from '../Editor/plugins/EditorRefPlugin';
import LoadHTMLPlugin from '../Editor/plugins/LoadHTMLPlugin';
import EditablePlugin from '../Editor/plugins/ControlEditablePlugin';
import { TbCloudExclamation } from "react-icons/tb";

export const FeedCrudModal = ({isShow, onHide, mode, updatingFeed}) => {
    const fileInputRef = useRef(null);
    const feedEditorRef = useRef(null); // submit anında içeriği okumak için
    const [canSubmit, setCanSubmit] = useState(false);
    const {createNewFeed, editFeed, processing} = useFeed(state => state);
    const [uploading, setUploading] = useState(false);
    const [sending, setSending] = useState(false);

    const isBusy = processing || sending || uploading;

    const [attachments, setAttachments] = useState(() => {
        if (mode === 'edit' && updatingFeed && updatingFeed.medias) {
            return updatingFeed.medias;
        }else{
            return [];
        }
    });

    const [waitingAttachments, setWaitingAttachments] = useState([]);
    const uploadedMediasRef = useRef({}); // Yüklenen görselleri takip etmek için ref (dictionary) {localId: mediaData}

    const uploadFile = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/FeedUpload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Upload error:', error);
            return null;
        }
    }

    const deleteAttachment = async (mediaUrl) => {
        try {
            const response = await fetch(`/api/DeleteFile?fileUrl=${encodeURIComponent(mediaUrl)}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

        } catch (error) {
            console.error('Delete error:', error);
            alert('Dosya silinirken bir hata oluştu');
        }
    }
    
    const removeWaitingAttachment = (id) => {
        setWaitingAttachments(prev => prev.filter(att => att.id !== id));
        const alreadyUploaded = uploadedMediasRef.current[id];
        if (alreadyUploaded) {
            deleteAttachment(alreadyUploaded.mediaUrl).catch((error) => console.log('Error deleting uploaded file:', error));
            delete uploadedMediasRef.current[id];
        }
    }
     
    const addAttachment = () => {
        if(isBusy) return;
        fileInputRef.current?.click();
    }

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if(attachments.length + waitingAttachments.length >= 3){
            alert('You can attach up to 3 files only.');
            return;
        }

        if(!checkImageSizeAllowed(file.size)) 
            return;

        setWaitingAttachments(prev => [...prev, {file: file, status: 'waiting', id : Date.now()}]);
        e.target.value = '';
    }

    const checkImageSizeAllowed = (size) => {
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (size && size > MAX_SIZE) {
            alert("Each image must be less than 5MB in size");
            return false;
        }
        return true;
    };

    const handleClickRemoveAttachment = (attachment) => {
        setAttachments(prev => prev.filter(att => att.mediaUrl !== attachment.mediaUrl));
    }

    const handleCanSubmitChange = useCallback((value) => {
        setCanSubmit(value);
    }, []);

    const handleSubmit = async () => {
        // İçeriği submit anında ref'ten oku, her keystroke'ta state güncellemesi yok
        let content = '';
        if (feedEditorRef.current) {
            feedEditorRef.current.getEditorState().read(() => {
                content = $generateHtmlFromNodes(feedEditorRef.current);
            });
        }

        setSending(true);
        setUploading(true);

        // hepsini yükleniyor göstermek için
        setWaitingAttachments(
            prev => prev.map((item) => ({...item, status: 'uploading'}))
        )

        const finalAttachments = [...attachments];
        let hasImageUploadError = false;
        for(const att of waitingAttachments){
            // önceden yüklendiyse tekrar yükleme
            const alreadyUploaded = uploadedMediasRef.current[att.id];
            if (alreadyUploaded) {
                finalAttachments.push(alreadyUploaded);
                setWaitingAttachments((prev) =>
                    prev.map((img) => (img.id === att.id ? { ...img, status: "uploaded" } : img))
                );
                continue;
            }

            const result = await uploadFile(att.file)
            
            if(result){
                // setWaitingAttachments(prev => prev.filter(item => item.id !== att.id));
                // setAttachments(prev => [...prev, result]);
                setWaitingAttachments((prev) => prev.map((img) => (img.id === att.id ? { ...img, status: "uploaded" } : img)));
                finalAttachments.push(result);
                uploadedMediasRef.current[att.id] = result;
            }else{
                hasImageUploadError = true;
                // Hata durumunda image.error değerini true olarak ayarla
                setWaitingAttachments((prev) => prev.map((img) => (img.id === att.id ? { ...img, status: "error" } : img)));
            }
        }

        setUploading(false);
        if (hasImageUploadError) {
            alert("Some images failed to upload. Please try again.");
            setSending(false);
            return;
        }

        let result;
        if (mode === 'edit' && updatingFeed) {
            result = await editFeed(updatingFeed.id, content, finalAttachments);
        }else{
            result = await createNewFeed(content, finalAttachments)
        }

        if(result){
            uploadedMediasRef.current = {};
            onClose();
        }else{
            alert("Failed to send the feed. Please try again.");
        }

        setSending(false);
    }

    const onClose = () => {
        Object.values(uploadedMediasRef.current).forEach((media) => {
            if (media?.mediaUrl) {
                deleteAttachment(media.mediaUrl).catch((error) => console.log('Error deleting uploaded file:', error));
            }
        });

        onHide();
    }

  return (
    <Modal animation={false} centered show={isShow} onHide={onClose} id="feed-crud-modal" className='feed-modal' backdrop="static" keyboard={false}>
        <Modal.Header>
            <div className='flex-grow-1'>
                <Modal.Title className={styles.title}>{mode === 'create' ? 'Create Post' : 'Edit Post'}</Modal.Title>
            </div>
            {
                isBusy
                ? <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                : <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            }
            
        </Modal.Header>
        <Modal.Body>
            <div className='d-flex flex-column'>
                <UserRow />
                <NewFeedInput 
                    editorRef={feedEditorRef}
                    onCanSubmitChange={handleCanSubmitChange}
                    isUpdate={mode === 'edit'} 
                    updateContent={mode === 'edit' ? updatingFeed.content : ''} 
                    disabled={isBusy}
                />

                <div className='d-flex flex-column'>
                    <div className='d-flex flex-row justify-content-between'>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect}
                            // accept="image/*,video/*,audio/*"
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <BiImageAdd 
                            size={32} 
                            className={styles.add_image_icon} 
                            title='Add Image' 
                            onClick={addAttachment}
                            style={{ cursor: uploading ? 'wait' : 'pointer', opacity: uploading ? 0.5 : 1 }}
                        />
                        <EmojiSelect 
                            height={350}
                            width={300}
                            iconSize={24}
                            searchDisabled={true}
                            onEmojiClick={(emojiData) => {
                            if (feedEditorRef.current) {
                                feedEditorRef.current.update(() => {
                                const selection = $getSelection();
                                if (selection) {
                                    const emojiNode = $createEmojiNode(emojiData.emoji, emojiData.unified);
                                    selection.insertNodes([emojiNode]);
                                }
                                });
                            }
                            }} 
                            disabled={sending} 
                        />
                    </div>
                    <div className='mt-3 border-top pt-2'>
                        {
                            attachments.map((attachment, index) => (
                                <div key={index} className={styles.attachment_wrapper}>
                                    <img src={attachment.mediaUrl} alt={`attachment-${index}`} className='border rounded' />
                                    <div>
                                        {
                                            attachment.status  === 'uploading'
                                            ? <button className='btn btn-sm w-100 btn-secondary mt-1' disabled>
                                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                            </button>
                                            : <button className='btn btn-sm w-100 btn-secondary mt-1' onClick={() => handleClickRemoveAttachment(attachment)}>Remove</button>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                        {
                            waitingAttachments.map((item, index) => (
                                <div key={index} className={styles.attachment_wrapper}>
                                    <div className={styles.img_wrapper}>
                                        <img src={URL.createObjectURL(item.file)} alt={`attachment-${index}`} className={`border rounded ${item.status === 'error' ? 'border-danger' : ''}`} />
                                        {
                                            item.status === 'error' && <div className={styles.error_overlay}>
                                                <TbCloudExclamation size={48} color="#dc3545" />
                                            </div>
                                        }
                                    </div>
                                    <div>
                                        {
                                            item.status === 'uploading'
                                            ? <button className='btn btn-sm w-100 btn-secondary mt-1' disabled>
                                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                            </button>
                                            : <button className='btn btn-sm w-100 btn-secondary mt-1' onClick={() => removeWaitingAttachment(item.id)}>Remove</button>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <button onClick={handleSubmit} className={`btn ${styles.submit_button} mt-3 w-100`} disabled={!canSubmit || isBusy}>
                        {
                            isBusy
                                ? <div>
                                    <span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span>
                                    Saving...
                                </div>
                                : mode === 'create' ? 'Post' : 'Update'
                        }
                    </button>
                </div>
            </div>

        </Modal.Body>
    </Modal>
  )
}


const EDITOR_INITIAL_CONFIG = {
  editable: true,
  nodes: [EmojiNode],
  onError: (error) => { throw error; },
};

const NewFeedInput = React.memo(({isUpdate, updateContent = '', editorRef, onCanSubmitChange, disabled = false}) => {

    const handleEditorChange = useCallback((editorState) => {
        editorState.read(() => {
            const canSubmit = $getRoot().getTextContent().trim().length > 0;
            onCanSubmitChange?.(canSubmit);
        });
    }, [onCanSubmitChange]);

    const handleWrapperClick = () => {
        if(editorRef.current)
            editorRef.current.focus();
    }

    return (
        <div className={`${styles.new_feed_input_wrapper} d-flex flex-column py-1`} onClick={handleWrapperClick} >
            <LexicalComposer initialConfig={EDITOR_INITIAL_CONFIG}>
                <OnChangePlugin onChange={handleEditorChange} />
                <EditorRefPlugin editorRef={editorRef} />
                <EditablePlugin isEditable={!disabled} />
                {isUpdate && updateContent && <LoadHTMLPlugin htmlContent={updateContent} />}
                <div className={styles.editor_container}>
                    <div className={styles.editor_inner}>
                        <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                autoCorrect="off"
                                spellCheck="false"
                                autoFocus="true"
                                className={`${disabled ? styles.editor_input_disabled : ''}`}
                                aria-placeholder="Write a comment..."
                                placeholder={
                                    <p className={styles.editor_placeholder}>What do you want to share?</p>
                                }
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                        />
                        <AutoFocusPlugin />
                    </div>
                </div>
            </LexicalComposer>
        </div>
    )
});

NewFeedInput.displayName = 'NewFeedInput';

const UserRow = () => {
    const {user} = useUser();

    return (
        <div className='mb-2 d-flex flex-row align-items-center'>
            <FeedAvatar imageUrl={user?.imageUrl} altName={user?.firstName} />
            <span className={`ms-2 fw-semibold ${styles.user_name}`}>{user?.firstName} {user?.lastName}</span>
        </div>
    )
}