import React from 'react'
import { SendMessageArea } from './SendMessageArea';
import { ChatMessagesArea } from './ChatMessagesArea';

export const ChatPanel = ({isChatOpen, toggleChat}) => {

  return (
    <div style={{display : isChatOpen ? 'unset' : "none"}} className="chat-panel-main col-12 col-md-3">
      <div className="chat-panel">
        <div className="chat-header">
          <h4>Chat Panel</h4>
          <button className="close-btn" onClick={toggleChat}>×</button>
        </div>
        <ChatMessagesArea />
        <SendMessageArea />
      </div>
    </div>
  )
}
