import React, { useState } from 'react'
import { useSignalR } from "@/context/SignalRContext2";
import SweetAlert2 from 'react-sweetalert2';
import useToastify from '@/utils/hooks/useToastify';
import Swal from "sweetalert2";
import Link from 'next/link';

export const MessageListHeader = () => {
    const { fireToastify } = useToastify();
    const {
        activeConversation,
        deleteMessageHistory,
        activeConversationItem,
      } = useSignalR();

    const [showMenu, setShowMenu] = useState(false)
    const toggleShowMenu = () => {
        setShowMenu(prev => !prev)
    }

    const deleteMessageHandler = async () => {
        return await deleteMessageHistory(activeConversation)
    }
    

    async function handleClickDelete(){
        const result = await Swal.fire({
            title: 'Warning',
            text: 'Are you sure want to delete message history?',
            showCancelButton : true,
            confirmButtonText: 'Yes, Delete !',
            didOpen : () => setShowMenu(false)
        })

        if(result.isConfirmed){
            var deleteResult = await deleteMessageHandler();
            if(deleteResult){
                fireToastify("Message history deleted successfully.", "success");
            }else{
                fireToastify("Failed to delete message history.", "error");
            }
        }
    }

  return (
    <div className="recent-chat-content-header d-flex justify-content-between">
        <div className="col-auto">
            <h3 className="recent-chat-content-user-fullname"><Link href={`/user-profile/${activeConversationItem.slug}`}>{activeConversationItem.fullName}</Link></h3>
            <p className="recent-chat-content-user-last-seen">
                <span>
                    {activeConversationItem.onlineStatusName}
                </span>
            </p>
        </div>
        <div className="col-auto">
            <div className="dots-icon">
                <img className="dots-button" src="/images/dots.png" width="40" height="40" onClick={toggleShowMenu} />
                <div id="dots-area" style={{display : showMenu ? "block" : "none" }}>
                    <div className="chat_actions">
                        <ul className="mb-0">
                            <li onClick={handleClickDelete} className='delete-history'>
                                <span>Delete Messages</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
