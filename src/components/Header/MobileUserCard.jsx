import { Skeleton } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import TimeZoneDisplay from '../UI/TimeZoneDisplay'
import { useUser } from '@/context/UserContext'

const MobileUserCard = () => {
    const { user } = useUser();
  let fullName = `${user?.firstName} ${user?.lastName}`;

  if(user == null){
    return <div className="profile-top d-flex flex-row align-items-center gap-2 pb-3 mt-4" >
        <Skeleton variant="circular" width={50} height={50} />
        <div className="profile-name d-flex flex-column">
            <Skeleton variant="rounded" width={100} height={20} />
            <span
                // style="font-size:13px;padding-top:3px"
                style={{ fontSize: "13px", paddingTop: "3px" }}
                id="fTalkIdSpan"
            >
                <Skeleton variant="rounded" width={80} height={14} />
            </span>
            <span className="timezone-span" id="timezoneSpan">
                <Skeleton variant="rounded" width={60} height={14} />
            </span>
        </div>
    </div>
  }

  return (
    <div className="profile-top d-flex flex-row align-items-center gap-2 pb-3 mt-4" >
        <div className="col-3">
            <Image
                src={user.imageUrl || "/images/empty-image.png"}
                className="profile-img"
                alt={fullName}
                width={50}
                height={50}
            />
        </div>

        <div className="profile-name d-flex flex-column col-12">
            <span>{fullName}</span>
            <span
                // style="font-size:13px;padding-top:3px"
                style={{ fontSize: "13px", paddingTop: "3px" }}
                id="fTalkIdSpan"
            >
                FTALK ID: {user.fTalkId}
            </span>
            <span className="timezone-span" id="timezoneSpan">
                <TimeZoneDisplay
                    timeZone={user?.timeZone}
                    isInSpan={false}
                />
            </span>
        </div>
    </div>
  )
}

export default MobileUserCard