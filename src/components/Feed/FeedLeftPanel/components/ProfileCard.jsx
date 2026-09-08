import { useUser } from "@/context/UserContext"
import { Skeleton } from "@mui/material";
import FeedAvatar from "../../FeedAvatar";
import moment from 'moment-timezone';
import styles from './ProfileCard.module.css';
import PanelLink from "./PanelLink";

const ProfileCard = () => {
  const { user, loading } = useUser();
  return (
    loading || !user
    ? <Skl />
    : <ProfileInfo user={user} />
  )
}

export default ProfileCard

const Skl = () => (
  <div className={styles.card}>
    <Skeleton variant="circular" width={120} height={120} className="mx-auto mb-3" />
    <Skeleton variant="text" sx={{ fontSize: 18 }} width={160} className="mx-auto mb-2" />
    <Skeleton variant="text" sx={{ fontSize: 14 }} width={200} className="mx-auto" />
  </div>
)

const ProfileInfo = ({ user }) => {
  const formattedTimeZone = moment.tz(user?.timeZone).format('Z');

  return (
    <div className={styles.card}>
        <FeedAvatar
          imageUrl={user.imageUrl}
          altName={user.firstName}
          width={80}
          height={80}
          priority={true}
          className={styles.avatar_ring}
        />

      <p className={styles.user_name}>{user.firstName} {user.lastName}</p>

      <div className={styles.profile_info}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>FTALK ID</span>
          <span className={styles.infoValue}>{user.fTalkId}</span>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>GMT{formattedTimeZone}</span>
          <span className={styles.infoValue}>{user?.timeZone}</span>
        </div>
      </div>

    <div className={styles.links}>
        <PanelLink href={`/user-profile/${user?.slug}`} text="My Profile" />
        <PanelLink href="/feed/user/me" text="My Posts" />
      </div>
    </div>
  )
}