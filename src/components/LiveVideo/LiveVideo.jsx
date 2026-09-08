"use client";
import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import React, { useEffect, useState } from "react";
import { HiVideoCamera, HiVideoCameraSlash } from "react-icons/hi2";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { MdChatBubbleOutline, MdOutlineSafetyDivider } from "react-icons/md";
import { BsPersonPlus, BsPersonSquare } from "react-icons/bs";

import "./style.css";

const LiveVideo = ({toggleChat, isChatOpen}) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  
  const remoteUsers = useRemoteUsers();
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  usePublish([localMicrophoneTrack, localCameraTrack]);
  return (
    <>
      <div
        className="room"
        style={{
          height:
            selectedUser === null
              ? remoteUsers.length > 0
                ? "65%"
                : "100%"
              : "100%",
        }}
      >
        <div
          style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}
        ></div>
        <div className="user-list gap-2 gap-sm-3">
          <div
            className={`user ${
              selectedUser === "local"
                ? "selected"
                : selectedUser === null
                ? ""
                : "non-selected"
            }`}
            onClick={() => handleUserClick("local")}
          >
            <LocalUser
              className="local-user-video"
              audioTrack={localMicrophoneTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              videoTrack={localCameraTrack}
              cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
            >
              {/* <samp className="user-name">You</samp> */}
            </LocalUser>
          </div>

          {/* Remote Users */}
          {remoteUsers.map((user) => (
            <div
              className={`user ${
                selectedUser === user.uid
                  ? "selected"
                  : selectedUser === null
                  ? ""
                  : "non-selected"
              }`}
              key={user.uid}
              onClick={() => handleUserClick(user.uid)}
            >
              <RemoteUser
                className="remote-user-video"
                cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                user={user}
              >
                {/* <samp className="user-name">{user.uid}</samp> */}
              </RemoteUser>
            </div>
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <div className="control">
        <div className="control-buttons d-flex gap-2 gap-sm-3 gap-md-4">
          <div className="d-flex flex-column align-items-center justify-content-center">
            {micOn ? (
              <button
                className="btn room-btn"
                onClick={() => setMic((a) => !a)}
              >
                <BiMicrophone color="white" style={{ width: 24, height: 24 }} />
              </button>
            ) : (
              <button
                className="btn room-btn-off"
                onClick={() => setMic((a) => !a)}
              >
                <BiMicrophoneOff
                  color="#181A1C"
                  style={{ width: 24, height: 24 }}
                />
              </button>
            )}
            <div style={{ color: "#fff", marginTop: 5 }}> Mute</div>
          </div>
          <div className="d-flex flex-column align-items-center">
            <button
              className={`btn  ${cameraOn ? "room-btn" : "room-btn-off"}`}
              onClick={() => setCamera((a) => !a)}
            >
              {cameraOn ? (
                <HiVideoCamera
                  color="white"
                  style={{ width: 24, height: 24 }}
                />
              ) : (
                <HiVideoCameraSlash
                  color="#181A1C"
                  style={{ width: 24, height: 24 }}
                />
              )}
            </button>
            <div style={{ color: "#fff", marginTop: 5 }}>Video</div>
          </div>
          {/* <div className="d-flex flex-column align-items-center">
            <button className={`btn room-btn`}>
              <BsPersonPlus color="white" style={{ width: 24, height: 24 }} />
            </button>
            <div style={{ color: "#fff", marginTop: 5 }}>Invite</div>
          </div> */}
          <div className="d-flex flex-column align-items-center">
            <div className="btn-wrapper" style={{ position: "relative" }}>
              <button className={`btn  ${!isChatOpen ? "room-btn" : "room-btn-off"}`}
               onClick={toggleChat}
               >
                <MdChatBubbleOutline
                  color={`${isChatOpen ?  "#181A1C" : "white"}`}
                  style={{ width: 24, height: 24 }}
                />
              </button>
              <span className="chat-message"></span>
            </div>
            <div style={{ color: "#fff", marginTop: 5 }}>Chat</div>
          </div>
          {remoteUsers.length > 0 && (
            <div className="d-flex flex-column align-items-center">
              <button
                className={`btn ${
                  selectedUser === null ? "room-btn" : "room-btn-off"
                }`}
                onClick={() => {
                  if (selectedUser === null) {
                    setSelectedUser(
                      remoteUsers.length > 0 ? remoteUsers[0].uid : "local"
                    );
                  } else {
                    setSelectedUser(null);
                  }
                }}
              >
                {selectedUser === null ? (
                  <BsPersonSquare
                    color="white"
                    style={{ width: 18, height: 24 }}
                  />
                ) : (
                  <MdOutlineSafetyDivider
                    color="#181A1C"
                    style={{ width: 24, height: 24 }}
                  />
                )}
              </button>
              <div style={{ color: "#fff", marginTop: 5 }}>Screen</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LiveVideo;
