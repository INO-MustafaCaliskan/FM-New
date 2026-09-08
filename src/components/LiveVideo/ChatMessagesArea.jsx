import React, { useEffect, useState } from 'react'
import { Message } from './Message'
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';
import { useMeetingStore } from '@/context/MeetingContext';

export const ChatMessagesArea = () => {
    const connection = useMeetingStore((state) => state.connection);
    const [messages, setMessages] = useState([]);
    const {user} = useUser();

    useEffect(() => {

        if(connection){
          connection.on("ReceiveMeetingGroupMessage", (meetingMessageData) => {
            // id, fromUserId, fromUserName, message, createdDate
            setMessages((prevMessages) => [...prevMessages, meetingMessageData]);
          });
      
          connection.on("UserConnectedMeetingGroup", message => {
            toast.info(message, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            })
            
          })
        }
        
        return () => {
          connection.off("ReceiveMeetingGroupMessage");
          connection.off("UserConnectedMeetingGroup");
        }
      }, [connection])

  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-messages">
        {messages.map((message) => {
            return <Message key={message.id} isMyMessage={message?.fromUserId == user.id} message={message.message} userName={message.fromUserName} />
        })}
        <div ref={messagesEndRef} />
    </div>
  )
}
