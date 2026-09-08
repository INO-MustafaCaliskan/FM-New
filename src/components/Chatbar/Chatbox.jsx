'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ChatboxTop } from './ChatboxTop';
import { ChatbarMessages } from './ChatbarMessages';
import { ChatbarInputs } from './ChatbarInputs';
import { useSignalR } from "@/context/SignalRContext2";
import { xor } from 'lodash';

export const Chatbox = ({chatBoxData}) => {
      const {
        closeChatBox,
        getMessageHistory,
        getQuickChatUser,
        getOldMessageHistory,
        minimizeChatBox,
        maximizeChatBox,
        messageViewed
    } = useSignalR();
    const chatBoxRef = useRef();

    const onChatMinimize = () => {
        // if (!chatBoxRef || !chatBoxRef.current) return;
    
        // // toggle chatbox-min class
        // chatBoxRef.current.classList.toggle("chatbox-min");
        toggleChatBox()
      };

    const toggleChatBox = () => {
      if (chatBoxData.isMinimized) {
        maximizeChatBox(chatBoxData.user.id);
        
        const hasUnreadMessages = chatBoxData.messages.some((message) => message.status === 1 && message.fromUserId === chatBoxData.user.id);
        if(hasUnreadMessages)
          messageViewed(chatBoxData.user.id)

      } else {
        minimizeChatBox(chatBoxData.user.id);
      }
    }

    const onChatClose = async() => {
      await closeChatBox(chatBoxData.user.id);
    };


    useEffect(() => {
      const fetchHistory = async () => {
        await getMessageHistory(chatBoxData.user.id);
      };

      fetchHistory()
    }, [chatBoxData.user.id])

    useEffect(() => {
      if(chatBoxData.messages.length === 0) return;

      if(!chatBoxData.isMinimized && chatBoxData.hasUnreadMessage){
        messageViewed(chatBoxData.user.id);
      }
      
    }, [chatBoxData.messages, chatBoxData.isMinimized, chatBoxData.hasUnreadMessage, chatBoxData.user.id, messageViewed]);

  return (
    <div className="chatbox-container">
      <div className="chat-user-status position-absolute chat-user-typing-networks"></div>

      <div className={`chatbox ${chatBoxData.isMinimized ? 'chatbox-min' : ''}`} id="chatbox-popup" ref={chatBoxRef}>
        <ChatboxTop user={chatBoxData.user} isMinimized={chatBoxData.isMinimized} hasUnreadMessage={chatBoxData.hasUnreadMessage} onChatMinimize={onChatMinimize} onChatClose={onChatClose} />
        <ChatbarMessages chatBoxData={chatBoxData} getOldMessageHistory={getOldMessageHistory} />
        <ChatbarInputs userId={chatBoxData.user.id} />
      </div>
    </div>
  );
}
