import useFormatDate from "@/utils/hooks/useFormatDate";
import { useEffect, useRef, useState } from "react";
import { Message, RevokedMessageBox } from "./Message";
import { Button, Modal } from "react-bootstrap";
import { useSignalR } from "@/context/SignalRContext2";
import { toast } from "react-toastify";

export const ChatbarMessages = ({chatBoxData, getOldMessageHistory}) => {
  const {getConversationByUserId, activeConversation, revokeMessage} = useSignalR();
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const deletingMessageRef = useRef(null);

  const formatDate = useFormatDate();

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
}, [chatBoxData.messages]);

const oldMessageHandler = async () => {
    oldMessagesLoadingRef.current = true;
    // createdDate'i timestamp (milisaniye) olarak gönder
    const createdDate = chatBoxData.messages[0].createdDate;
    const timestamp = new Date(createdDate).getTime();
    await getOldMessageHistory(chatBoxData.user.id, timestamp);
  }

  const setDeletingMessageShowModal = async (messageId) => {
      deletingMessageRef.current = messageId;
      handleShow();
  }

  const revokeMessageHandler = async () => {
      const messageId = deletingMessageRef.current;
      if(!deletingMessageRef.current)
          return;

      const result =  await revokeMessage(messageId, chatBoxData.user.id, 1);
      if(result){
          deletingMessageRef.current = null;
          handleClose();
          toast.success("Message deleted successfully.");
      }else{
          toast.error("Failed to delete message. Please try again.");
      }
  }


  return (
    <div className="chat-messages" ref={messageEndRef}>
      {
        chatBoxData.hasOldMessages && 
        <div className="d-flex flex-row justify-content-center"> 
            <button className="link-primary" onClick={oldMessageHandler} >Load Old Messages</button>
        </div>
      }
      {
        chatBoxData.messages.map((message, index) => {
          return message.isRevoked 
            ? <RevokedMessageBox key={index} isPartnerMessage={chatBoxData.user.id === message.fromUserId} />
            : <Message
              key={index} 
              message={message}
              dateFormatter={formatDate}
              isPartnerMessage={chatBoxData.user.id === message.fromUserId}
              onMessageRevoke={setDeletingMessageShowModal}
            />
        })
      }

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
