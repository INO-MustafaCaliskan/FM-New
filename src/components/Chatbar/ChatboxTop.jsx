import Link from 'next/link'
import { faMinus, faClose, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import useFormatDate from '@/utils/hooks/useFormatDate';

export const ChatboxTop = ({ user, isMinimized, hasUnreadMessage, onChatMinimize, onChatClose }) => {
  const handleShowProfile = (e) => {

      window.location.href = `/user-profile/${user.slug}`;
 
  };

  const formatDate = useFormatDate();
  const statusClass = {
    1: "online", // Available
    2: "away",
    3: "busy",   // InAMeeting
    4: "offline"
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <div>
        <p className='tooltip-chat tooltip-country'>
          <span>{user.countryFlag}</span>
          <span className='tooltip-country-name'>{user.countryName}</span>
        </p>
        <p className='tooltip-chat tooltip-company'>{user.companyName}</p>
      </div>
    </Tooltip>
  );


  return (
    <div className={`chatbox-top ${hasUnreadMessage ? "unread" : ""}`}>
      <OverlayTrigger
        placement="top"
        overlay={renderTooltip}
      >
        <div
          onClick={handleShowProfile}
          className="chatbox-avatar">
          <span>
            <img alt={user.firstName} src={user.imageUrl || "/images/empty-image.png"} />
          </span>
        </div>
      </OverlayTrigger>
      <div className="chat-partner-name">
        <div
          className="chat-status-header"
        >
          <span
            className="chatbox-user-fullname"
            id="fullName"
            onClick={onChatMinimize}
          >
            {user.firstName} {user.lastName}
          </span>
          <div className="spn-chat-user-online-status">
            <i className={`chat-status ${statusClass[user.onlineStatus]}`}></i>
            {
              user.onlineStatus === 4
                ? user.lastAccessDate ? `Last Seen: ${formatDate(user.lastAccessDate, true)}` : "Never"
                : statusClass[user.onlineStatus]
            }

          </div>
        </div>
      </div>

      <div className="chatbox-icons">
        <span className='quick-message-small' onClick={onChatMinimize}>
          <FontAwesomeIcon
            icon={isMinimized ? faChevronUp : faMinus}
            width={16}
            height={16}
          />
        </span>

        <span className='quick-message-small' onClick={onChatClose}>
          <FontAwesomeIcon
            icon={faClose}
            width={16}
            height={16}
          />
        </span>
      </div>
    </div>
  )
}