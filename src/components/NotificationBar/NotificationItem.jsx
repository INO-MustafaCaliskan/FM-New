import Image from 'next/image'
import React, { memo, useState } from 'react'
import HumanizedDate from '../UI/HumanizedDate '
import Dropdown from "react-bootstrap/Dropdown";

const FALLBACK_SRC = "/images/ft-logo-square.png";

const NotificationItem = ({notification}) => {
  const [src, setSrc] = useState(notification.imageUrl || FALLBACK_SRC);

  return (
    <Dropdown.Item href={notification.redirectUrl} className={notification.read ? "" : "unread"}>
        <div className="d-flex notification-container">
            <div className="notification-profile">
                <Image width={40} height={40} onError={() => setSrc(FALLBACK_SRC)} src={src} alt={notification.imageUrl} className="img-fluid" />
            </div>
            <div className="notification-content notification-type-content">
              {/* artık user bilgisi gelmiyor ama ilerde title ekleyebiliriz duruma göre */}
              {/* {
                (notification.fromUserFirstName || notification.fromUserLastName) && (
                  <p className='nt-title'>{notification.fromUserFirstName} {notification.fromUserLastName}</p>
                )
              } */}
                <p className='nt-description'>{notification.description}</p>
                <p className='dt'><HumanizedDate dateString={notification.sendDate} humanize={true} /></p>
            </div>
        </div>
    </Dropdown.Item>
  )
}


export default memo(NotificationItem)