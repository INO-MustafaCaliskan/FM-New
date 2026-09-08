import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import "./styles.css"
import { useUser } from '@/context/UserContext';

function MembershipAnnouncement() {
  const hideMembershipAnnouncement = localStorage.getItem("hideMembershipAnnouncement");
  let hideUntil;

  if(hideMembershipAnnouncement){
    hideUntil = Date.parse(JSON.parse(hideMembershipAnnouncement));
  }

  const [show, setShow] = useState(!hideMembershipAnnouncement || Date.now() > hideUntil);
  const {user, loading} = useUser();

  if(loading || !user) return null;

   if(!user?.announcement || !show) return null;

  const onCloseHandler = () => {
    setShow(false);
    localStorage.setItem("hideMembershipAnnouncement", JSON.stringify(new Date(Date.now() + 86400000)));
  }

  return (
    <Alert onClose={onCloseHandler} dismissible className="text-center alert-bar m-0">
      <strong>{user.announcement?.title}</strong> {user.announcement?.content}
    </Alert>
  );
}

export default MembershipAnnouncement;