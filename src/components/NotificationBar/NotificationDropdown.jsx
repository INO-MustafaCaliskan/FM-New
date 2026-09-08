import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faC, faCog } from "@fortawesome/free-solid-svg-icons";
import "./notification-dropdown.css";
import { useNotificationContext } from "@/context/NotificationContext";
import { useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import NotificationItem from "./NotificationItem";
import { NotificationCount } from "./NotificationCount";

export const NotificationDropdown = () => {
    const router = useRouter();
    const isFirstClick = useRef(true);
    const {notifications, setReadAll, loadInitialNotifications, loading} = useNotificationContext();
    const [firstMarkSeen, setFirstMarkSeen] = useState(true);
    
    const onToggleHandler = (toggleState) => {
        if(toggleState && isFirstClick.current){
            loadInitialNotifications();
            isFirstClick.current = false;
        }

        if(firstMarkSeen && toggleState === false){
            setReadAll();
            setFirstMarkSeen(false)
        }
    }

  return (
    <Dropdown onToggle={onToggleHandler}>
      <Dropdown.Toggle className="notification-btn" variant="none">
        <NotificationCount />
      </Dropdown.Toggle>

      <Dropdown.Menu className="notification-dropdown">
        <div className="notification-header d-flex">
            <h6>Notifications</h6>
            <div className="notification-settings" onClick={() => router.push("/account-settings?tab=advanced-settings")}>
                <FontAwesomeIcon icon={faCog} />
            </div>
        </div>
        <div className="notification-data">
            {
                loading 
                ? (
                    <div className="d-flex flex-row justify-content-center align-items-center gap-2 py-4">
                        <CircularProgress size={24}/> Loading...
                    </div>
                )
                : notifications.map((notification, index) => {
                    return (
                        <NotificationItem key={index} notification={notification} />
                    )
                })
            }
            {
                (!loading && notifications.length === 0)
                ? (
                    <div className="d-flex flex-row justify-content-center align-items-center gap-2 py-4">
                        No notifications found
                    </div>
                )
                :(
                    <a href="/notifications" className="notification-all">
                        View All
                    </a>
                )
            }

        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};
