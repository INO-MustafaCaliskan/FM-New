import HumanizedDate from "@/components/UI/HumanizedDate ";

import Image from "next/image";
import { faEnvelope, faFile, faImage, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";


const ConversationItem = ({conversation, isActive, onItemClick}) => {
  const statusClass = {
    1 : "online", // Available
    2 : "away",
    3 : "busy",   // InAMeeting
    4 : "offline"
  }

  return (
    <li
      onClick={() => onItemClick(conversation.user.id)}
      className={`recent-chat-user-item ${
        isActive
          ? "active"
          : ""
      }`}
      data-is-unread="7"
      data-is-favorite="True"
      data-user-id={conversation.user.id}
    >
      <div className="row">
        <div className="col-3 recent-chat-profile-wrapper position-relative">
          <div className="connect360-profile-avatar">
            <i className={`recent-chat-status ${statusClass[conversation.user.onlineStatus]}`}></i>
            {
              conversation.user.isFavorite && <FontAwesomeIcon title="Favorite User" className="recent-chat-favorite" icon={faStar} color="#ffc000" />
            }
            <Image
              width={50}
              height={50}
              alt={conversation.user.fullName || "show-user-profile"}
              className="recent-chat-profile-picture show-user-profile"
              data-user-id={conversation.user.id}
              src={conversation.user.imageUrl || "/images/empty-image.png"}
            />
          </div>
        </div>
        <div className="col-6">
          <h3 className="recent-chat-fullname">{conversation.user.fullName}</h3>
          <p className="recent-chat-message-short">
            {
              !conversation.lastMessageFromMe && conversation.lastMessageStatus === 1
              && <FontAwesomeIcon icon={faEnvelope} color="red" className="me-1" />
            }

            {conversation.hasAttachment
              ? conversation.lastMessageFromMe ? "Attachment send" : "Attachment received"
              : conversation.lastMessageContent}
          </p>
        </div>
        <div className="col-3 text-end">
          <HumanizedDate
            className="recent-chat-last-message-time"
            humanize={true}
            dateString={conversation.lastMessageDate}
          />
        </div>
      </div>
    </li>
  );
};


export default memo(ConversationItem);