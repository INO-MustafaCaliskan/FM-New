import React from "react";

export const Message = ({ isMyMessage, message, userImage, userName }) => {
  return (
    <>
      {isMyMessage ? (
        <div className="user-message">
          <div className="message-content">
            <strong>{userName}</strong>
            <p>{message}</p>
          </div>
          {/* <img src={userImage} alt={userName} class="avatar" /> */}
        </div>
      ) : (
        <div className="message">
          {/* <img src={userImage} alt={userName} class="avatar" /> */}
          <div className="message-content">
            <strong>{userName}</strong>
            <p>{message}</p>
          </div>
        </div>
      )}
    </>
  );
};
