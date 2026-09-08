import { memo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const ConversationsHeader = ({conversationFilterHandler, searchQuery, setSearchQuery}) => {
    const [showMessageFilter, setShowMessageFilter] = useState(false)
    const [filter, setFilter] = useState('all');

    const onConversationFilterHandler = (filter) => {
      conversationFilterHandler(filter);
      setFilter(filter);
      setShowMessageFilter(false)
    }

  return (
    <div>
        <div className="chat_left_top d-flex flex-row justify-content-between">
            <input value={searchQuery || ""} onChange={(e) => setSearchQuery(e.target.value)} type="text" className="search_message" placeholder="Search Users" />
            <div>
                <FontAwesomeIcon color={showMessageFilter ? "#f97a29" : ""} className="switch_icon" icon={faFilter} width={20} height={20} onClick={() => setShowMessageFilter(!showMessageFilter)} />
                <div className="message_detail_toggle" style={{display : showMessageFilter ? "block" : "none"}}>
                    <div className="chat_actions">
                        <ul className="mb-0">
                            <li className={`message-type ${filter === "all" ? 'active' : ''}`} onClick={() => onConversationFilterHandler("all")}>
                                <span>All Messages</span>
                            </li>
                            <li className={`message-type ${filter === "unread" ? 'active' : ''}`} onClick={() => onConversationFilterHandler("unread")}>
                                <span>Unread Messages</span>
                            </li>
                            <li className={`message-type ${filter === "favorite" ? 'active' : ''}`}onClick={() => onConversationFilterHandler("favorite")}>
                                <span>Favorited Users</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default memo(ConversationsHeader);
