'use client'
import InoBreadcrumb from '@/components/InoBreadcrumb/InoBreadcrumb'
import { useEffect, useRef, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { useSignalR } from "@/context/SignalRContext2";
import InoLoading from "@/components/InoLoading/InoLoading";
import { NoConversation } from "@/components/chat-360/NoConversation";
import { MessageList } from "@/components/chat-360/MessageList";
import ConversationItem from "@/components/chat-360/ConversationItem";
import ConversationsHeader from "@/components/chat-360/ConversationsHeader";
import { CircularProgress } from "@mui/material";
import "./chat.css";

const Chat = () => {
    const {
        getConversationInfos,
        activeConversation,
        conversations,
        connection,
        startNewConversation,
        messageHistoryLoading,
        conversationsLoading,
        setComponent
      } = useSignalR();
    
      const startConversation = async (userId) => {
        if(activeConversation === userId) 
          return;

        await startNewConversation(userId);
      }
      
      const [conversationFilter, setConversationFilter] = useState('all');
      const [searchQuery, setSearchQuery] = useState('');
    
      const setFilterHandler = (filter) => {
        setConversationFilter(filter);
        setSearchQuery('');
      }
    
      let filteredConversations = conversations;
    
      if(searchQuery.trim() !== '') {
        filteredConversations = conversations.filter(conversation =>
            conversation.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }else if(conversationFilter === 'unread') {
        filteredConversations = conversations.filter(conversation =>
            conversation.lastMessageFromMe === false && conversation.lastMessageStatus === 1
        );
      }else if(conversationFilter === 'favorite') {
        filteredConversations = conversations.filter(conversation =>
            conversation.user.isFavorite === true
        );
      }
      
      useEffect(() => {
        async function fetchConversations(){
            await getConversationInfos();
        };
        
        if(connection && connection.state == "Connected"){
          setComponent("page")
          fetchConversations();
        }
      }, [connection, setComponent, getConversationInfos]);

      if (connection === null || connection.state !== "Connected")
        return <InoLoading />;
  return (
    <Container>
        <InoBreadcrumb linkName="Chat" />
        <Card>
            <Card.Body>
                <div className="connect-360-wrapper">
                    <div className="col-lg-4 p-0 connect-360-recent-list position-relative">
                        <ConversationsHeader conversationFilterHandler={setFilterHandler} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        {
                            conversationsLoading && <p className="text-center mt-2"><CircularProgress /></p>
                        }
                        <ul className="message-top-list mb-0">
                            {
                                (filteredConversations.length === 0 && (searchQuery || conversationFilter !== "all")) && <li className="mt-2">
                                    <p className="text-center">No Conversations Found</p>
                                </li>
                            }
                            {
                                filteredConversations.map((conversation, index) => {
                                    return <ConversationItem 
                                        key={index} 
                                        conversation={conversation} 
                                        isActive={conversation.user.id === activeConversation} 
                                        onItemClick={startConversation}
                                            />
                                })
                            }
                        </ul>
                    </div>
                    <div className="col-lg-8 p-0 d-flex flex-column position-relative connect-360-message-content">
                        {activeConversation === null 
                            ? <NoConversation />
                            : <MessageList messagesLoading={messageHistoryLoading} />
                        }
                    </div>
                </div>
            </Card.Body>
        </Card>
    </Container>
  )
}

export default Chat;