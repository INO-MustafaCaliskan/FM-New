import FeedAvatar from '@/components/Feed/FeedAvatar'
import Link from 'next/link'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import styles from './ActiveUserCard.module.css'

const ActiveUserCard = ({ user, getQuickChatUser }) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  const isNameLong = fullName.length > 25;
  const displayName = isNameLong ? `${fullName.substring(0, 25)}...` : fullName;

  return (
    <div className={`d-flex align-items-center ${styles.card_container}`}>
      <FeedAvatar imageUrl={user.imageUrl} altName={user.firstName} height={46} width={46} />
      <div className="ms-2 flex-fill" style={{ minWidth: 0 }}>
        {isNameLong ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-name-${user.id}`} className="custom-orange-tooltip">{fullName}</Tooltip>}
          >
            <span className={styles.user_name} style={{ cursor: 'pointer', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</span>
          </OverlayTrigger>
        ) : (
          <span className={styles.user_name} style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</span>
        )}
        <div className="mt-1 d-flex align-items-center">
          <Link
            className={`flex-fill d-flex justify-content-center align-items-center me-1 ${styles.view_profile} ${styles.action_btn}`}
            href={`/user-profile/${user.slug}`}
          >
            <span>View Profile</span>
          </Link>
          <button
            onClick={() => getQuickChatUser(user.id)}
            className={`flex-fill d-flex justify-content-center align-items-center ${styles.chat_btn} ${styles.action_btn}`}
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActiveUserCard