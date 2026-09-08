import React, { useEffect, useRef, useState } from 'react'
import InoLoading from "../InoLoading/InoLoading";
import { useSignalR } from "@/context/SignalRContext2";
import MessageBubble, { RevokedMessageBox } from "./MessageBubble";
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

export const Messages = ({messagesLoading}) => {
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const deletingMessageRef = useRef(null);

    const {
        messages,
        activeConversation,
        activeConversationItem,
        activeConversationHasOldMessages,
        getOldMessageHistory,
        messageViewed,
        revokeMessage,
        getConversationByUserId
      } = useSignalR();

      const messageEndRef = useRef(null);
      const handleScrollToBottom = () => {
        setTimeout(() => {
            messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
        }, 100)
      };

    // yeni mesajlar yüklendiği zaman scroll'u eski pozisyonunda tutuyor.
    const prevHeightRef = useRef(0);
    const prevScrollTopRef = useRef(0);
    const oldMessagesLoadingRef = useRef(false);
    const firsLoadingRef = useRef(true);
    useEffect(() => {
        const messageBox = messageEndRef.current;
    
        if (messageBox) {
            const prevHeight = prevHeightRef.current;
            const prevScrollTop = prevScrollTopRef.current;
            const newHeight = messageBox.scrollHeight;
        
            if (prevHeight !== 0 && newHeight > prevHeight && (oldMessagesLoadingRef.current || firsLoadingRef.current)) {
                const heightDifference = newHeight - prevHeight;
                messageBox.scrollTop = heightDifference;
            }else{
                handleScrollToBottom();
            }
        
            prevHeightRef.current = newHeight;
            prevScrollTopRef.current = messageBox.scrollTop;
            oldMessagesLoadingRef.current = false;
            firsLoadingRef.current = false;
        }

        // Mesajlar yüklendiğinde son mesajı okundu olarak işaretle
        if(messages.length > 0){
            const lastMessage = messages[messages.length - 1];
            if(lastMessage.fromUserId === activeConversation && lastMessage.status === 1) {  
                messageViewed(lastMessage.fromUserId)
            }
        }

    }, [messages, messageViewed, activeConversation]);

    const oldMessageHandler = async () => {
        oldMessagesLoadingRef.current = true;
        const createdDate = messages[0].createdDate;
        const timestamp = new Date(createdDate).getTime();
        await getOldMessageHistory(activeConversationItem.id, timestamp)
      }

    const setDeletingMessageShowModal = async (messageId) => {
        deletingMessageRef.current = messageId;
        handleShow();
    }

    const revokeMessageHandler = async () => {
        const conversation = getConversationByUserId(activeConversation);
        const messageId = deletingMessageRef.current;
        if(!deletingMessageRef.current)
            return;

        const result =  await revokeMessage(messageId, conversation.user.id, conversation.type);
        if(result){
            deletingMessageRef.current = null;
            handleClose();
            toast.success("Message deleted successfully.");
        }else{
            toast.error("Failed to delete message. Please try again.");
        }
    }

  return (
    <div className="recent-chat-message-box flex-fill"  ref={messageEndRef}>
        {
            messagesLoading && <InoLoading />
        }
        <div className="recent-message-field">
            {
                !messagesLoading && activeConversationHasOldMessages && 
                <div className="align-self-center"> 
                    <button className="link-primary" onClick={oldMessageHandler} >Load Old Messages</button>
                </div>
            }
            {
                messages.map((message, index) => {
                    return message.isRevoked
                        ? <RevokedMessageBox key={index} isMyMessage={message.fromUserId != activeConversation} />
                        : <MessageBubble 
                            key={index} 
                            id={message.id}
                            text={message.message} 
                            date={message.createdDate} 
                            isMyMessage={message.fromUserId != activeConversation} 
                            attachments={message.attachments}
                            isRead={message.status === 2}
                            readDate={message.viewedDate}
                            onMessageRevoke={setDeletingMessageShowModal}
                        />
                })
            }
        </div>
        <div className="chat-typing-content">

        </div>

        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Delete Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this message? This action cannot be undone.</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={revokeMessageHandler}>
                    Delete Message
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}
