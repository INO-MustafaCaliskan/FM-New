"use client";

import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import client from '@/utils/client';

let isMobile = false;
// Developmentta hot-reload olduğunda sunucuya heartbeat göndermeyi durduruyor. bunun için aşağıdaki global değişkenleri kullanıyoruz.
// Production buildde bir soruna yol açmıyordu ancak developmentta sorun çıkıyordu.
let globalConnection = null;




const SignalRContext = createContext();

export const useSignalR = () => useContext(SignalRContext);

const globalSessionId = Cookies.get('sessionId');

let audio = null;
const playMessageSound = () => {
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch((error) => {
            console.log("Ses çalma engellendi (tarayıcı politikası):", error);

        });
    }
}

const initialState = {
    connection: null,
    component: 'page',
    myInfo: null,
    canUseChat: true, // Kullanıcının chat kullanma yetkisi
    chatRestrictionReason: null, // Kısıtlama nedeni
    // -- ALT KISIMDAKİ PROPLAR SAYFADAKİ CHAT İÇİN KULLANIYOR 
    conversationsType: 'dm', // dm yada group 
    conversations: [],  // chat sayfasındaki görüşmeler
    activeConversation: null,   // aktif conversation kullanıcısının userId'si
    activeConversationItem: null,  // aktif conversation kullanıcısının bilgileri
    activeConversationHasOldMessages: true,
    messages: [],   // chat sayfasındaki ekrandaki mesajlar
    conversationsLoading: true,
    messageHistoryLoading: false,
    // -- ÜST KISIMDAKİ PROPLAR SAYFADAKİ CHAT İÇİN KULLANIYOR
    onlineUsers: [],
    chatBoxes: [],
    pendingQuickChatUsers: [],
    unreadMessagesCount: 0,
    unreadConversationCount: 0,
    lastLeavedUser: null,
    lastConnectedUser: null
};

export const SignalRProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (window) {
            isMobile = window.innerWidth < 992;
        }
    }, []);

    useEffect(() => {
        // Initialize audio only on client side
        if (typeof window !== 'undefined' && !audio) {
            audio = new Audio("/incoming-call-sound/message.mp3", { preload: "auto", loop: false });
            audio.load();
        }
    }, []);


    useEffect(() => {
        // Eğer zaten global connection varsa yeni connection açma
        if (globalConnection && globalConnection.state !== 'Disconnected') {
            dispatch({ type: 'SET_CONNECTION', payload: globalConnection });
            return;
        }

        const connect = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_CHAT_HUB}?sessionid=${Cookies.get('sessionId')}`,  {
                accessTokenFactory: () => Cookies.get('accessToken'),
                headers: {
                    "sessionid": Cookies.get('sessionId'),
                },
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Error)
            .build();

        connect.serverTimeoutInMilliseconds = 30000;
        connect.keepAliveIntervalInMilliseconds = 15000;

        connect.start()
            .then(async () => {
                globalConnection = connect; // Global referansı kaydet
                dispatch({ type: 'SET_CONNECTION', payload: connect });

                connect.on("ClientConnected", message => {
                    dispatch({ type: 'CLIENT_CONNECTED', payload: message });
                });
                connect.on("ClientLeaved", message => {
                    dispatch({ type: 'CLIENT_LEAVED', payload: message });
                });

                connect.on("ReceiveMessage", message => {
                    // Önce mesajı işle
                    dispatch({ type: 'RECEIVE_MESSAGE', payload: message });
                });

                connect.on("ReceiveGroupMessage", message => {
                    dispatch({ type: 'RECEIVE_GROUP_MESSAGE', payload: message });
                });
                connect.on("UserReadMessages", userId => {
                    dispatch({ type: 'USER_READ_MESSAGES', payload: userId });
                });

                connect.on("MessageRevoked", obj => {
                    // obj : { messageId: guid, revokedBy: guid userid, conversationType: 1 (dm) or 2 (group), groupId : guid or null }
                    dispatch({ type: 'MESSAGE_REVOKED', payload: obj });
                })

                connect.on("ConnectionEstablished", result => {
                    dispatch({ type: 'CONNECTION_ESTABLISHED', payload: result });
                });

                connect.on("UserStatusChanged", status => {
                    dispatch({ type: 'USER_STATUS_CHANGED', payload: status });
                })

                connect.on("Ping", () => {
                    connect.invoke("Pong")
                        .catch(err => console.error(err.toString()));
                });

                connect.on("Logout", (sessionId) => {
                    if (sessionId === globalSessionId) {
                        setTimeout(() => {
                            window.location.href = "/sign-in";
                        }, 1000);
                    }
                })

                connect.on("ForceLogout", () => {
                    window.location.href = "/sign-out";
                })
            })
            .catch(error => console.log('Connection failed: ', error));

        connect.onclose(() => {
            dispatch({ type: "SET_CONNECTION", payload: null });
        });

        connect.onreconnected(() => {
            dispatch({ type: "SET_CONNECTION", payload: connect });
        });

        return () => {
            connect.off("ClientConnected");
            connect.off("ClientLeaved");
            connect.off("ReceiveMessage");
            connect.off("ReceiveGroupMessage");
            connect.off("UserReadMessages");
            connect.off("MessageRevoked");
            connect.off("MyInfoReceived");
            connect.off("ConnectionEstablished");
            connect.off("UserStatusChanged");
            connect.off("Ping");
            connect.off("Logout");
            connect.off("ForceLogout");
            connect.off("close");
            connect.off("reconnected");
            connect.stop().catch(err => console.error("SignalR disconnect error:", err));
        }
    }, []);

    const closeChatBox = useCallback((userId) => {
        dispatch({ type: 'CLOSE_CHATBOX', payload: userId });
    }, []);

    const minimizeChatBox = useCallback((userId) => {
        dispatch({ type: 'MINIMIZE_CHATBOX', payload: userId });
    }, []);

    const maximizeChatBox = useCallback((userId) => {
        dispatch({ type: 'MAXIMIZE_CHATBOX', payload: userId });
    }, []);

    const sendMessage = useCallback((userOrGroupId, message, attachment) => {
        if (!state.canUseChat) {
            toast.error(state.chatRestrictionReason || "You don't have permission to use chat");
            return;
        }

        if (state.connection) {
            const tempId = crypto.randomUUID();
            if (state.conversationsType === 'dm') {
                state.connection.invoke("SendMessageToUser", tempId, userOrGroupId, message, attachment);
                dispatch({ type: 'ADD_MY_NEW_MESSAGE_TO_CONVERSATION', payload: { messageId: tempId, toUserId: userOrGroupId, message, attachment } });
            } else {
                state.connection.invoke("SendMessageToGroup", tempId, userOrGroupId, message, attachment);
                dispatch({ type: 'ADD_MY_NEW_MESSAGE_TO_GROUP_CONVERSATION', payload: { messageId: tempId, toGroupId: userOrGroupId, message, attachment } });
            }
        }
    }, [state.connection, state.conversationsType, state.canUseChat, state.chatRestrictionReason]);

    const sendFastTextMessageToUser = useCallback((toUserId, message) => {
        if (state.connection) {
            state.connection.invoke("SendMessageToUser", toUserId, message, 1);
        }
    }, [state.connection]);

    const messageViewed = useCallback(async (senderId) => {
        if (state.connection) {
            // senderId yada conversationId'dne biri verilmeli.
            await state.connection.invoke("MessageViewed", senderId, null);

            // kullanıcının mesajlarını okuyunca karşıdan gelen mesajları okundu olarak işaretle
            if (state.component === 'chatbar')
                dispatch({ type: 'SET_MESSAGES_VIEWED', payload: senderId });
        }
    }, [state.connection, state.component])

    const getMessageHistory = useCallback(async (userId) => {
        dispatch({ type: 'SET_MESSAGE_HISTORY_LOADING' });
        var result = await client.get('Chat/MessageHistory/' + userId);
        if (result && result.data.success) {
            dispatch({ type: 'RECEIVE_MESSAGE_HISTORY', payload: { ...result.data.data, userId: userId } });
        }

        dispatch({ type: 'SET_MESSAGE_HISTORY_LOADED' });
    }, []);

    const getOldMessageHistory = useCallback(async (userOrGroupId, dateBefore) => {
        const url = 'Chat/' + (state.conversationsType === 'dm' ? 'MessageHistory/' : 'GroupMessageHistory/');
        var result = await client.get(url + userOrGroupId + '?dateBefore=' + dateBefore);
        if (result && result.data.success) {
            dispatch({ type: 'RECEIVE_OLD_MESSAGE_HISTORY', payload: { ...result.data.data, userId: userOrGroupId } });
        }
    }, [state.conversationsType]);

    const getConversationInfos = useCallback(async () => {
        dispatch({ type: 'SET_CONVERSATIONS_LOADING' });
        var result = await client.get('Chat/Conversations');
        if (result && result.data.success) {
            dispatch({ type: 'RECEIVE_CONVERSATIONS', payload: { conversations: result.data.data, type: 'dm' } });
        }
        dispatch({ type: 'SET_CONVERSATIONS_LOADED' });
    }, []);

    const getGroupConversationInfos = useCallback(async () => {
        dispatch({ type: 'SET_CONVERSATIONS_LOADING' });
        var result = await client.get('Chat/GetGroupConversations');
        if (result && result.data.success) {
            dispatch({ type: 'RECEIVE_CONVERSATIONS', payload: { conversations: result.data.data, type: 'group' } });
        }
        dispatch({ type: 'SET_CONVERSATIONS_LOADED' });
    }, []);

    /// bu metod sadece sayfadaki chat için geçerli
    const startNewConversation = useCallback(async (userId) => {
        if (!state.canUseChat) {
            toast.error(state.chatRestrictionReason || "You don't have permission to use chat");
            return;
        }

        dispatch({ type: 'SET_MESSAGE_HISTORY_LOADING' });
        if (state.component === 'page') {
            const messagesResult = await client.get('Chat/MessageHistory/' + userId);
            const userResult = await client.get('Chat/GetUser/' + userId + '?noCache=' + false);
            if (!userResult || !userResult.data.success)
                return;

            dispatch({ type: 'START_NEW_CONVERSATION', payload: { user: userResult.data.data, messagesData: messagesResult.data.data } });
            dispatch({ type: 'SET_MESSAGE_HISTORY_LOADED' });
        }
    }, [state.component, state.canUseChat, state.chatRestrictionReason]);

    const switchToGroup = useCallback(async (conversationId) => {
        dispatch({ type: 'SET_MESSAGE_HISTORY_LOADING' });
        // Join user to group conversation
        if (state.conversationsType === 'group' && state.activeConversation && state.activeConversation !== conversationId) {
            state.connection.invoke("LeaveGroup", state.activeConversation);
        }
        state.connection.invoke("JoinGroup", conversationId);

        const messagesResult = await client.get('Chat/GroupMessageHistory/' + conversationId);
        if (messagesResult && messagesResult.data.success)
            dispatch({ type: 'SWITCH_GROUP_CONVERSATION', payload: messagesResult.data.data });

        dispatch({ type: 'SET_MESSAGE_HISTORY_LOADED' });
    }, [state.connection, state.activeConversation, state.conversationsType]);

    /// bu metod sadece chatbar için geçerli
    const getQuickChatUser = useCallback(async (userId, noCache = true) => {
        if (!state.canUseChat) {
            toast.error(state.chatRestrictionReason || "You don't have permission to use chat");
            return;
        }

        const existUser = state.chatBoxes.find((x) => x.user.id === userId);
        if (existUser) {
            if (existUser.isMinimized)
                maximizeChatBox(userId)
        }
        else {
            // const messagesResult = await client.get('Chat/MessageHistory/' + userId);
            const userResult = await client.get('Chat/GetUser/' + userId + '?noCache=' + noCache);
            if (!userResult || !userResult.data.success)
                return;
            if (userResult && userResult.data.success)
                dispatch({ type: 'QUICK_CHAT_USER_RECEIVED', payload: {user : userResult.data.data, isMinimized : false} });
        }
    }, [maximizeChatBox, state.chatBoxes, state.canUseChat, state.chatRestrictionReason]);

    const deleteMessageHistory = useCallback(async (userId) => {
        const deleteResult = await client.get('Chat/DeleteHistory/' + userId);
        if (deleteResult && deleteResult.data.success)
            dispatch({ type: 'MESSAGE_HISTORY_DELETED', payload: userId });
        return deleteResult;
    }, []);

    const revokeMessage = useCallback(async (messageId, userOrGroupId, conversationType) => {
        const revokeResult = await state.connection.invoke("RevokeMessage", messageId, userOrGroupId, conversationType || 1);
        dispatch({ type : 'MESSAGE_REVOKED_BY_ME', payload : messageId });
        return revokeResult;
    }, [state.connection])

    const getUnreadConversationCount = useCallback(async () => {
        const count = await client.get('Chat/UnreadConversationCount/');
        dispatch({ type: 'RECEIVE_UNREAD_CONVERSATION_COUNT', payload: count });
    }, []);

    const loadChatBoxes = useCallback(() => {
        const chatBoxes = JSON.parse(localStorage.getItem("chatBoxes")) || [];
        if (isMobile && chatBoxes.length > 1) {
            chatBoxes.splice(1, chatBoxes.length - 1);
            chatBoxes[0].isMinimized = true;
            updateWithNoMessages(chatBoxes);
        }
        dispatch({ type: 'SET_CHATBOXES', payload: chatBoxes });
        return chatBoxes;
    }, []);

    const getPendingChatBoxes = useCallback(async () => {
        state.pendingQuickChatUsers.forEach(async userId => {

            const existUser = state.chatBoxes.find((x) => x.user.id === userId);
            if (existUser?.isMinimized) 
                return;

            const userResult = await client.get('Chat/GetUser/' + userId + '?noCache=true');
            if (!userResult || !userResult.data.success)
                return;

            if (userResult && userResult.data.success)
                dispatch({ type: 'QUICK_CHAT_USER_RECEIVED', payload: {user : userResult.data.data, isMinimized : true} });

            setTimeout(() => {
                playMessageSound();
            }, 200);
        });
        dispatch({ type: 'CLEAR_PENDING_QUICK_CHAT_USER' });
    }, [state.pendingQuickChatUsers, state.chatBoxes]);

    /// Kullanıcıların konuştuklarını localstorage'a kaydediyoruz ama durumları güncellenmiyor. sayfa yenilendikçe ilk nasıl kaydedildiyse o şekilde kalıyordu.
    /// Bu metodla localstorage'daki chatboxların durumlarını güncelliyoruz.
    const refreshChatBoxStatus = useCallback(async (ids) => {
        if (ids.length === 0) return;
        const userIds = ids.join(',');
        const results = await state.connection.invoke("RefreshChatBoxStatus", userIds);
        dispatch({ type: 'REFRESH_CHATBOX_STATUS', payload: results });
    }, [state.connection]);

    const setComponent = useCallback((type) => {
        dispatch({ type: 'SET_COMPONENT', payload: type });
    }, [])

    /// 'dm' yada 'group'
    const setConversationType = useCallback((type) => {
        dispatch({ type: 'SET_CONVERSATIONS_TYPE', payload: type });
    }, [])


    const isUserOnline = useCallback(async (userId) => {
        return await state.connection.invoke("IsUserOnline", userId);
    }, [state.connection])

    const changeMyStatus = useCallback(async (status) => {
        if (state.connection) {
            await state.connection.invoke("ChangeUserStatus", status);
            dispatch({ type: 'MY_STATUS_CHANGED', payload: status });
        }
    }, [state.connection]);

    const logout = useCallback(async () => {
        if (state.connection) {
            await state.connection.invoke("Logout");
        }
    }, [state.connection]);

    const getConversationByUserId = useCallback((userId) => {
        const conversation = state.conversations.find(c => c.user.id === userId);
        return conversation ? conversation : null;
    }, [state.conversations]);

    return (
        <SignalRContext.Provider value={{
            ...state,
            sendMessage,
            sendFastTextMessageToUser,
            messageViewed,
            getMessageHistory,
            getOldMessageHistory,
            getConversationInfos,
            getGroupConversationInfos,
            startNewConversation,
            switchToGroup,
            getQuickChatUser,
            loadChatBoxes,
            getPendingChatBoxes,
            refreshChatBoxStatus,
            closeChatBox,
            maximizeChatBox,
            minimizeChatBox,
            deleteMessageHistory,
            revokeMessage,
            getUnreadConversationCount,
            setComponent,
            setConversationType,
            isUserOnline,
            changeMyStatus,
            logout,
            getConversationByUserId
        }}>
            {children}
        </SignalRContext.Provider>
    );
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_CONNECTION':
            return { ...state, connection: action.payload };
        case 'SET_COMPONENT':
            return { ...state, component: action.payload };
        case 'CONNECTION_ESTABLISHED':
            return {
                ...state,
                myInfo: action.payload.me,
                canUseChat: action.payload.canUseChat,
                chatRestrictionReason: action.payload.reason
            };

        case 'SET_CONVERSATIONS_TYPE':
            return { ...state, conversationsType: action.payload, activeConversation: null, activeConversationItem: null, messages: [] };
        case 'CLIENT_CONNECTED':
            if (state.component === 'page') {
                return {
                    ...state,
                    lastConnectedUser: action.payload,
                    conversations: state.conversations.map((conversation) => {
                        if (conversation.user.id === action.payload.id) {
                            conversation.user.onlineStatus = action.payload.onlineStatus;
                            conversation.user.onlineStatusName = action.payload.onlineStatusName;
                        }
                        return conversation;
                    })
                }
            } else {
                return {
                    ...state,
                    lastConnectedUser: action.payload,
                    chatBoxes: state.chatBoxes.map((chatbox) => {
                        if (chatbox.user.id === action.payload.id) {
                            chatbox.user.onlineStatus = action.payload.onlineStatus;
                        }
                        return chatbox;
                    })
                }
            }
        case 'CLIENT_LEAVED':
            if (state.component === 'page') {
                return {
                    ...state,
                    conversations: state.conversations.map((conversation) => {
                        if (conversation.user.id === action.payload) {
                            conversation.user.onlineStatus = 4;
                            conversation.user.lastAccessDate = new Date().toISOString();
                        }
                        return conversation;
                    })
                }
            } else {
                return {
                    ...state,
                    lastLeavedUser: action.payload,
                    chatBoxes: state.chatBoxes.map((chatbox) => {
                        if (chatbox.user.id === action.payload) {
                            chatbox.user.onlineStatus = 4;
                            chatbox.user.lastAccessDate = new Date().toISOString();
                        }
                        return chatbox;
                    })
                }
            }
        case 'RECEIVE_MESSAGE':

            if (state.component === 'page') {
                if (state.conversationsType === 'group') {
                    toast.info(`You have a new message from ${action.payload.user.fullName}`);
                    return state; // State'i geri döndür
                }

                const conversationToUpdate = state.conversations.find(conversation => conversation.user.id === action.payload.user.id);
                const otherConversations = state.conversations.filter(conversation => conversation.user.id !== action.payload.user.id);

                if (!state.activeConversation || action.payload.fromUserId !== state.activeConversation) {
                    // toast.info(`You have a new message from ${action.payload.fromUserName}`);
                }

                const msg = {
                    id: action.payload.id,
                    fromUserId: action.payload.user.id,
                    firstName: action.payload.user.firstName,
                    lastName: action.payload.user.lastName,
                    fullName: `${action.payload.user.firstName} ${action.payload.user.lastName}`,
                    imageUrl: action.payload.user.imageUrl,
                    message: action.payload.message,
                    attachments: action.payload.attachments,
                    status: action.payload.status,
                    createdDate: action.payload.createdDate,
                    viewedDate: null,
                    modifiedDate: null
                }

                if (conversationToUpdate) {
                    // Update the conversation
                    const updatedConversation = {
                        ...conversationToUpdate,
                        lastMessageContent: action.payload.message,
                        lastMessageDate: action.payload.createdDate,
                        lastMessageStatus: conversationToUpdate.user.id === state.activeConversation ? 2 : action.payload.status,
                        lastMessageFromMe: action.payload.user.id === state.myInfo?.id,
                        hasAttachment: action.payload.attachments !== null,
                    };

                    if(updatedConversation.user.id !== state.activeConversation || document.hidden) {
                        setTimeout(() => {
                            playMessageSound();
                        }, 200)
                    }

                    // Add the updated conversation to the top of the list and append the rest of the conversations
                    return {
                        ...state,
                        conversations: [updatedConversation, ...otherConversations],
                        messages: state.activeConversation && action.payload.user.id === state.activeConversation ? [...state.messages, msg] : state.messages
                    }
                } else {
                    const newConversation = {
                        user: action.payload.user,
                        lastMessageContent: action.payload.message,
                        hasAttachment: action.payload.attachments !== null,
                        lastMessageDate: action.payload.createdDate,
                        lastMessageFromMe: false,
                        lastMessageStatus: action.payload.status,
                    }
                    //Notification Sound


                    return {
                        ...state,
                        conversations: [newConversation, ...state.conversations]
                    }
                }
            } else {
                const chatboxToUpdate = state.chatBoxes.find(chatbox => chatbox.user.id === action.payload.user.id);

                if (chatboxToUpdate) {
                    const newChatBoxes = state.chatBoxes.map((chatbox) => {
                        if (chatbox.user.id === action.payload.user.id) {
                            const newMessage = {
                                id: action.payload.id,
                                fromUserId: action.payload.user.id,
                                firstName: action.payload.user.firstName,
                                lastName: action.payload.user.lastName,
                                fullName: action.payload.user.fullName,
                                imageUrl: action.payload.user.imageUrl,
                                message: action.payload.message,
                                attachments: action.payload.attachments,
                                status: action.payload.status,
                                createdDate: action.payload.createdDate,
                                viewedDate: null,
                                modifiedDate: null,
                                isModifiedByAdmin: false,
                                modifyReason: null,
                                isDeleted: false,
                                deletedDate: null
                            }
                            chatbox.messages = [...chatbox.messages, newMessage]
                            chatbox.hasUnreadMessage = true;
                            if(chatbox.isMinimized || document.hidden) 
                                playMessageSound();
                        }
                        return chatbox;
                    })

                    return {
                        ...state,
                        chatBoxes: newChatBoxes
                    }
                } else {
                    return {
                        ...state,
                        pendingQuickChatUsers: [...state.pendingQuickChatUsers, action.payload.user.id]
                    }
                }
            }
        case 'RECEIVE_GROUP_MESSAGE':
            if (state.component === 'page') {
                if (state.conversationsType === 'dm')
                    return state; // State'i geri döndür

                const conversationToUpdate = state.conversations.find(conversation => conversation.id === action.payload.conversationId);
                const otherConversations = state.conversations.filter(conversation => conversation.id !== action.payload.conversationId);

                if (!state.activeConversation || action.payload.fromUserId !== state.activeConversation) {
                    // toast.info(`You have a new message from ${action.payload.fromUserName}`);
                }

                const msg = {
                    id: action.payload.id,
                    fromUserId: action.payload.user.id,
                    firstName: action.payload.user.firstName,
                    lastName: action.payload.user.lastName,
                    fullName: `${action.payload.user.firstName} ${action.payload.user.lastName}`,
                    imageUrl: action.payload.user.imageUrl,
                    message: action.payload.message,
                    attachments: action.payload.attachments,
                    status: action.payload.status,
                    createdDate: action.payload.createdDate,
                    viewedDate: null,
                    modifiedDate: null
                }

                if (conversationToUpdate) {
                    // Update the conversation
                    const updatedConversation = {
                        ...conversationToUpdate,
                        lastMessageContent: action.payload.message,
                        lastMessageDate: action.payload.createdDate,
                        lastMessageStatus: conversationToUpdate.conversationId === state.activeConversation ? 2 : action.payload.status,
                        lastMessageFromMe: action.payload.user.id === state.myInfo?.id,
                        hasAttachment: action.payload.attachments !== null,
                    };

                    // Add the updated conversation to the top of the list and append the rest of the conversations
                    return {
                        ...state,
                        conversations: [updatedConversation, ...otherConversations],
                        messages: state.activeConversation && action.payload.conversationId === state.activeConversation ? [...state.messages, msg] : state.messages
                    }
                } else {
                    const newConversation = {
                        id: action.payload.conversationId,
                        user: action.payload.user,
                        lastMessageContent: action.payload.message,
                        hasAttachment: action.payload.attachments !== null,
                        lastMessageDate: action.payload.createdDate,
                        lastMessageFromMe: false,
                        lastMessageStatus: action.payload.status,
                    }
                    return {
                        ...state,
                        conversations: [newConversation, ...state.conversations]
                    }
                }
            } else {
                const chatboxToUpdate = state.chatBoxes.find(chatbox => chatbox.user.id === action.payload.fromUserId);

                if (chatboxToUpdate) {
                    const newChatBoxes = state.chatBoxes.map((chatbox) => {
                        if (chatbox.user.id === action.payload.fromUserId) {
                            chatbox.messages = [...chatbox.messages, action.payload]
                            chatbox.hasUnreadMessage = true;
                        }
                        return chatbox;
                    })

                    return {
                        ...state,
                        chatBoxes: newChatBoxes
                    }
                } else {
                    return {
                        ...state,
                        pendingQuickChatUsers: [...state.pendingQuickChatUsers, action.payload.fromUserId]
                    }
                }
            }
        case 'RECEIVE_MESSAGE_HISTORY':
            if (state.component === 'page') {
                const newConversations = state.conversations.map((conversation) => {
                    if (conversation.user.id === action.payload.userId && conversation.lastMessageFromMe === false)
                        conversation.lastMessageStatus = 2;
                    return conversation;
                })

                return {
                    ...state,
                    conversations: newConversations,
                    activeConversation: action.payload.userId,
                    activeConversationHasOldMessages: action.payload.hasMoreMessages,
                    messages: action.payload.messages
                };
            }
            else {
                const hasUnreadMessages = action.payload.messages.some(m => m.status === 1 && m.fromUserId === action.payload.userId);
                const newChatboxes = state.chatBoxes.map((chatbox) => {
                    if (chatbox.user.id === action.payload.userId) {
                        chatbox.messages = action.payload.messages;
                        chatbox.hasOldMessages = action.payload.hasMoreMessages;
                        chatbox.hasUnreadMessage = hasUnreadMessages;
                    }
                    return chatbox;
                })

                return {
                    ...state,
                    chatBoxes: newChatboxes
                }
            }
        case 'RECEIVE_OLD_MESSAGE_HISTORY':
            if (state.component === 'page') {
                return {
                    ...state,
                    activeConversationHasOldMessages: action.payload.hasMoreMessages,
                    messages: [...action.payload.messages, ...state.messages]
                };
            } else {
                const newChatboxes = state.chatBoxes.map((chatbox) => {
                    if (chatbox.user.id === action.payload.userId) {
                        chatbox.messages = [...action.payload.messages, ...chatbox.messages];
                        chatbox.hasOldMessages = action.payload.hasMoreMessages;
                    }
                    return chatbox;
                })

                return {
                    ...state,
                    chatBoxes: newChatboxes
                }
            }
        case 'START_NEW_CONVERSATION':
            if (state.component === 'page') {
                if (state.conversations.find(c => c.user.id === action.payload.user.id)) {
                    const newConversations = state.conversations.map((conversation) => {
                        if (conversation.user.id === action.payload.user.id && conversation.lastMessageFromMe === false)
                            conversation.lastMessageStatus = 2;
                        return conversation;
                    })

                    return {
                        ...state,
                        conversations: newConversations,
                        activeConversation: action.payload.user.id,
                        activeConversationItem: action.payload.user,
                        activeConversationHasOldMessages: action.payload.messagesData?.hasMoreMessages || false,
                        messages: action.payload.messagesData?.messages || []
                    };
                }

                // mevcutta o conversation yoksa yenisini oluşturuyoruz.
                const lastMessage = action.payload.messagesData?.messages.length > 0 ? action.payload.messagesData.messages[action.payload.messagesData.messages.length - 1] : null;
                const newConversation = {
                    user: { ...action.payload.user },
                    type: 1,
                    lastMessageContent: lastMessage ? lastMessage.message : '',
                    hasAttachment: lastMessage ? lastMessage.attachments !== null : false,
                    lastMessageDate: lastMessage ? lastMessage.createdDate : undefined,
                    lastMessageFromMe: lastMessage ? lastMessage.fromUserId === action.payload.user.id : false,
                    lastMessageStatus: lastMessage ? lastMessage.status : undefined,
                }
                return {
                    ...state,
                    conversations: [newConversation, ...state.conversations],
                    activeConversation: action.payload.user.id,
                    activeConversationItem: newConversation,
                    activeConversationHasOldMessages: action.payload.messagesData?.hasMoreMessages || false,
                    messages: action.payload.messagesData?.messages || []
                };
            }
        case 'SWITCH_GROUP_CONVERSATION':
            if (state.conversations.find(c => c.id === action.payload.conversationId)) {
                const newConversations = state.conversations.map((conversation) => {
                    if (conversation.id === action.payload.conversationId && conversation.lastMessageFromMe === false)
                        conversation.lastMessageStatus = 2;
                    return conversation;
                })

                return {
                    ...state,
                    conversations: newConversations,
                    activeConversation: action.payload.conversationId,
                    activeConversationItem: state.conversations.find(c => c.id === action.payload.conversationId),
                    activeConversationHasOldMessages: action.payload.hasMoreMessages || false,
                    messages: action.payload.messages || []
                };
            }

        case 'RECEIVE_CONVERSATIONS':
            return { ...state, conversations: action.payload.conversations, conversationsType: action.payload.type };
        case 'RECEIVE_OLD_CONVERSATIONS':
            return { ...state, conversations: [...state.conversations, ...action.payload] };
        case 'SET_CONVERSATIONS_LOADING':
            return { ...state, conversationsLoading: true };
        case 'SET_CONVERSATIONS_LOADED':
            return { ...state, conversationsLoading: false };
        case 'SET_MESSAGE_HISTORY_LOADING':
            return { ...state, messageHistoryLoading: true };
        case 'SET_MESSAGE_HISTORY_LOADED':
            return { ...state, messageHistoryLoading: false };
        case 'SET_ACTIVE_CONVERSATION_ITEM':
            return { ...state, activeConversationItem: action.payload };
        case 'RECEIVE_UNREAD_MESSAGES_COUNT':
            return { ...state, unreadMessagesCount: action.payload };
        case 'RECEIVE_UNREAD_CONVERSATION_COUNT':
            return { ...state, unreadConversationCount: action.payload };
        case 'USER_READ_MESSAGES':
            if (state.component === 'page') {
                if (state.activeConversation && state.activeConversation == action.payload) {
                    const newConversations = state.conversations.map((conversation) => {
                        if (conversation.user.id === action.payload && conversation.lastMessageFromMe === false) {
                            conversation.lastMessageStatus = 2;
                        }
                        return conversation;
                    })

                    return {
                        ...state,
                        conversations: newConversations,
                        messages: state.messages.map(message => {
                            if (message.fromUserId != action.payload && message.status === 1) {
                                return { ...message, status: 2 };
                            }
                            return message;
                        })
                    };
                }
                return state;
            } else {
                const newChatBoxes = state.chatBoxes.map((chatbox) => {
                    if (chatbox.user.id === action.payload) {
                        chatbox.messages = chatbox.messages.map(message => {
                            if (message.fromUserId !== action.payload && message.status === 1) {
                                return { ...message, status: 2 };
                            }
                            return message;
                        });
                    }
                    return chatbox;
                });

                return {
                    ...state,
                    chatBoxes: newChatBoxes
                }
            }

        case 'SET_MESSAGES_VIEWED':
            const newChatBoxes = state.chatBoxes.map((chatbox) => {
                if (chatbox.user.id === action.payload) {
                    chatbox.hasUnreadMessage = false;
                    chatbox.messages = chatbox.messages.map(message => {
                        if (message.fromUserId === action.payload && message.status === 1) {
                            return { ...message, status: 2 };
                        }
                        return message;
                    });
                }
                return chatbox;
            });

            return {
                ...state,
                chatBoxes: newChatBoxes
            }


        case 'MESSAGE_REVOKED':
            if (state.component === 'page') {
                const isDm = state.conversationsType === 'dm' && action.payload.conversationType === 1;
                const isGroup = state.conversationsType === 'group' && action.payload.conversationType === 2;
                // DM'de activeConversation userId ile, Group'ta conversationId ile karşılaştır
                const isActiveConversation = isDm
                    ? state.activeConversation === action.payload.revokedBy
                    : isGroup
                        ? state.activeConversation === action.payload.groupId
                        : false;


                if ((isDm || isGroup) && isActiveConversation) {
                    return {
                        ...state,
                        messages: state.messages.map(message => {
                            if (message.id === action.payload.messageId) {
                                return {
                                    ...message,
                                    message: "This message has been deleted by the sender.",
                                    isRevoked: true,
                                    revokedDate: new Date().toISOString()
                                };
                            }
                            return message;
                        })
                    };
                }
                return state;
            } else {
                const newChatBoxes = state.chatBoxes.map((chatbox) => {
                    if ((chatbox.user.id === action.payload.revokedBy) || (chatbox.conversationId == action.payload.groupId)) {
                        return {
                            ...chatbox,
                            messages: chatbox.messages.map(message => {
                                if (message.id === action.payload.messageId) {
                                    return {
                                        ...message,
                                        message: "This message has been deleted by the sender.",
                                        isRevoked: true,
                                        revokedDate: new Date().toISOString()
                                    };
                                }
                                return message;
                            })
                        };
                    }
                    return chatbox;
                });

                return {
                    ...state,
                    chatBoxes: newChatBoxes
                };
            }

        case 'MESSAGE_REVOKED_BY_ME':
            if (state.component === 'page') {
                return {
                    ...state,
                    messages: state.messages.map(message => {
                        if (message.id === action.payload) {
                            return {
                                ...message,
                                message: "This message has been deleted by the sender.",
                                isRevoked: true,
                                revokedDate: new Date().toISOString()
                            };
                        }
                        return message;
                    })
                }
            } else {
                const newChatBoxes = state.chatBoxes.map((chatbox) => {
                    chatbox.messages = chatbox.messages.map(message => {
                        if (message.id === action.payload) {
                            return {
                                ...message,
                                message: "This message has been deleted by the sender.",
                                isRevoked: true,
                                revokedDate: new Date().toISOString()
                            };
                        }
                        return message;
                    });
                    return chatbox;
                });

                return {
                    ...state,
                    chatBoxes: newChatBoxes
                };
            }

        case 'MESSAGE_HISTORY_DELETED':
            if (state.component === 'page') {
                return {
                    ...state,
                    conversations: state.conversations.filter((conversation) => conversation.user.id !== action.payload),
                    messages: [],
                    activeConversation: null,
                    activeConversationItem: null
                }
            }
            return { ...state, messages: [] };
        case 'ADD_MY_NEW_MESSAGE_TO_CONVERSATION':
            const myMessage = {
                id: action.payload.messageId,
                fromUserId: state.myInfo.id,
                firstName: state.myInfo.firstName,
                lastName: state.myInfo.lastName,
                fullName: state.myInfo.fullName,
                imageUrl: state.myInfo.imageUrl,
                message: action.payload.message,
                attachments: action.payload.attachment !== null ? [action.payload.attachment] : null,
                status: 1,
                createdDate: new Date().toISOString(),
                viewedDate: null,
                modifiedDate: null,
                isModifiedByAdmin: false,
                modifyReason: null,
                isDeleted: false,
                deletedDate: null
            };

            if (state.component === 'page') {
                const updatingConversation = state.conversations.find(conversation => conversation.user.id === action.payload.toUserId);
                const others = state.conversations.filter(conversation => conversation.user.id !== action.payload.toUserId);
                if (updatingConversation) {
                    const updatedConversation = {
                        ...updatingConversation,
                        lastMessageContent: action.payload.message,
                        lastMessageDate: new Date().toISOString(),
                        lastMessageStatus: 1,
                        lastMessageFromMe: true,
                        hasAttachment: action.payload.attachment
                    };
                    const aa = [...state.messages, myMessage]
                    return {
                        ...state,
                        conversations: [updatedConversation, ...others],
                        messages: aa
                    };
                }
            } else {
                const newChatBoxes = state.chatBoxes.map((chatbox) => {
                    if (chatbox.user.id === action.payload.toUserId) {
                        chatbox.messages = [...chatbox.messages, myMessage];
                    }
                    return chatbox;
                });

                return {
                    ...state,
                    chatBoxes: newChatBoxes
                };
            }
        case 'ADD_MY_NEW_MESSAGE_TO_GROUP_CONVERSATION':
            const myGroupMessage = {
                id: action.payload.messageId,
                fromUserId: state.myInfo.id,
                firstName: state.myInfo.firstName,
                lastName: state.myInfo.lastName,
                fullName: state.myInfo.fullName,
                imageUrl: state.myInfo.imageUrl,
                message: action.payload.message,
                attachments: action.payload.attachment !== null ? [action.payload.attachment] : null,
                status: 1,
                createdDate: new Date().toISOString(),
                viewedDate: null,
                modifiedDate: null,
                isModifiedByAdmin: false,
                modifyReason: null,
                isDeleted: false,
                deletedDate: null
            };

            const updatingConversation = state.conversations.find(conversation => conversation.id === action.payload.toGroupId);
            const others = state.conversations.filter(conversation => conversation.id !== action.payload.toGroupId);
            if (updatingConversation) {
                const updatedConversation = {
                    ...updatingConversation,
                    lastMessageContent: action.payload.message,
                    lastMessageDate: new Date().toISOString(),
                    lastMessageStatus: 1,
                    lastMessageFromMe: true,
                    hasAttachment: action.payload.attachment !== null
                };
                const aa = [...state.messages, myGroupMessage]
                return {
                    ...state,
                    conversations: [updatedConversation, ...others],
                    messages: aa
                };
            }

        case 'SET_CHATBOXES':
            return { ...state, chatBoxes: action.payload };
        case 'QUICK_CHAT_USER_RECEIVED':
            const isChatBoxExist = state.chatBoxes.find((x) => x.user.id === action.payload.user.id);
            if (isChatBoxExist) return state;

            let cbs = state.chatBoxes;
            if (cbs.length === 3) {
                cbs = cbs.slice(1);
            }

            if (isMobile && cbs.length > 0) {
                cbs = []
            }
            const newChatboxes = [...cbs,
            {
                user: action.payload.user,
                messages: [],
                isMinimized: action.payload.isMinimized || false,
                hasUnredMessage: false,
                hasOldMessages: false
            }];

            updateWithNoMessages(newChatboxes);
            return { ...state, chatBoxes: newChatboxes };
        case 'CLOSE_CHATBOX':
            const chatBoxes = state.chatBoxes.filter((chatbox) => chatbox.user.id !== action.payload);
            updateWithNoMessages(chatBoxes);

            return { ...state, chatBoxes: chatBoxes };
        case 'MINIMIZE_CHATBOX':
            const minimizedChatBoxes = state.chatBoxes.map((chatbox) => {
                if (chatbox.user.id === action.payload) {
                    chatbox.isMinimized = true;
                }
                return chatbox;
            });

            updateWithNoMessages(minimizedChatBoxes);
            return { ...state, chatBoxes: minimizedChatBoxes };
        case 'MAXIMIZE_CHATBOX':
            const maximizedChatBoxes = state.chatBoxes.map((chatbox) => {
                if (chatbox.user.id === action.payload) {
                    chatbox.isMinimized = false;
                }
                return chatbox;
            });
            updateWithNoMessages(maximizedChatBoxes);
            return { ...state, chatBoxes: maximizedChatBoxes };
        case 'CLEAR_PENDING_QUICK_CHAT_USER':
            return {
                ...state,
                pendingQuickChatUsers: []
            };
        case 'REFRESH_CHATBOX_STATUS':
            const refreshedChatBoxes = state.chatBoxes.map((chatbox) => {
                const statusInfo = action.payload.find(status => status.userId === chatbox.user.id);
                if (statusInfo) {
                    chatbox.user.onlineStatus = statusInfo.onlineStatus;
                    chatbox.user.onlineStatusName = getStatusName(statusInfo.onlineStatus);
                    chatbox.user.lastAccessDate = statusInfo.lastAccessDate;
                }
                return chatbox;
            });
            updateWithNoMessages(refreshedChatBoxes);
            return { ...state, chatBoxes: refreshedChatBoxes };
        case 'USER_STATUS_CHANGED':
            let myInfoNew = state.myInfo;
            if (action.payload.userId === state.myInfo.id)
                myInfoNew = { ...state.myInfo, onlineStatus: action.payload.status, onlineStatusName: getStatusName(action.payload.status) };

            if (state.component === 'page') {
                const cnew = state.conversations.map((conversation) => {
                    if (conversation.user.id === action.payload.userId) {
                        conversation.user.onlineStatus = action.payload.status;
                        conversation.user.onlineStatusName = getStatusName(action.payload.status);
                    }
                    return conversation;
                });

                return {
                    ...state,
                    conversations: cnew,
                    myInfo: myInfoNew
                }
            } else {
                const cbnew = state.chatBoxes.map((chatbox) => {
                    if (chatbox.user.id === action.payload.userId) {
                        chatbox.user.onlineStatus = action.payload.status;
                    }
                    return chatbox;
                });

                return {
                    ...state,
                    chatBoxes: cbnew,
                    myInfo: myInfoNew
                }
            }
        case 'MY_STATUS_CHANGED':
            return {
                ...state,
                myInfo: {
                    ...state.myInfo,
                    onlineStatus: action.payload,
                    onlineStatusName: getStatusName(action.payload)
                }
            }
        default:
            return state;
    }
};

const updateWithNoMessages = (chatBoxes) => {
    const chatboxes = chatBoxes.map((chatbox) => {
        return {
            ...chatbox,
            user: {
                ...chatbox.user
            },
            messages: [] // Her zaman boş array
        };
    });

    localStorage.setItem("chatBoxes", JSON.stringify(chatboxes));
}

const getStatusName = (status) => {
    switch (status) {
        case 1: // Available
            return "Available";
        case 2: // Away
            return "Away";
        case 3: // InAMeeting
            return "Busy";
        case 4: // Offline
            return "Offline";
        default: // Offline
            return "";
    }
}