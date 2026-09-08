import React, { useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useNotificationContext } from "@/context/NotificationContext";


export const NotificationCount = () => {
    const {getUnreadCount, unreadCount} = useNotificationContext();

    useEffect(() => {
        getUnreadCount();
    }, [getUnreadCount])

  return (
    <>
        <FontAwesomeIcon icon={faBell} color="#f97a29" />
        <span className="notification-count">{unreadCount}</span>
    </>
  )
}
