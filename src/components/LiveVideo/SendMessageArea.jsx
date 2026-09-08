import { useMeetingStore } from '@/context/MeetingContext';
import React, { useState } from 'react'

export const SendMessageArea = () => {
    const sendMessageToMeetingGroup = useMeetingStore((state) => state.sendMessageToMeetingGroup);
    const [message, setMessage] = useState("");

    const sendMessageHandler = () => {
        let isBounced = false;
        if(!message || isBounced) return;

        isBounced = true;
        sendMessageToMeetingGroup(message);
        setMessage("");
        setTimeout(() => {
            isBounced = false;
        }, 500); // 1 second bounce time
    };
  return (
    <div className="d-flex flex-row flex-md-column align-items-start align-items-xl-center flex-lg-row chat-input">
        <input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                sendMessageHandler();
            }
        }} 
        type="text" 
        placeholder="Type a message..." 
        />
        <button className="send-btn" onClick={sendMessageHandler}>Send</button>
    </div>
  )
}
