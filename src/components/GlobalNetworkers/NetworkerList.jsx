import React, { useState } from "react";
import { useSignalR } from "@/context/SignalRContext2";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import NetworkerCard from "./NetworkerCard";
import { useMeetingStore } from "@/context/MeetingContext";

const NetworkerList = ({ networkersData, goNextPage, isLoading }) => {
  const signalRContext = useSignalR();
  const getQuickChatUser = signalRContext?.getQuickChatUser;
  const makeInstantCall = useMeetingStore((state) => state.makeInstantCall);

  const handleCall = (user) => {
    makeInstantCall({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fTalkId: user.fTalkId,
      imageUrl: user.imageUrl,
    });
  };

  return (
    <section
      className={`online-networks-content networkers-section ${networkersData.networkers.length === 0 ? "linear-bg" : ""}`}
    >
      <div className="row online-networkers-content-row position-relative mb-5">
        {networkersData.networkers.length === 0 && (
          <div className="col-lg-12 col-sm-12 text-center not-found-wrapper">
            <Image
              alt="not-found-image"
              width={175}
              height={175}
              src="/images/not-found.png"
              className="not-found-img"
            />
            <h3>Not Found Result</h3>
          </div>
        )}
        {networkersData.networkers.map((user, index) => {
          return (
            <NetworkerCard
              key={index}
              user={user}
              onClickMessage={getQuickChatUser || (() => { })}
              makeInstantCall={() => handleCall(user)}
            />
          );
        })}
        <div className="moreButtonArea">
          {isLoading ? (
            <div className="d-flex flex-row justify-content-center">
              <CircularProgress />
            </div>
          ) : (
            networkersData.currentPage < networkersData.totalPage && (
              <button onClick={goNextPage}>More Networkers</button>
            )
          )}
          <p>
            Total <span>{networkersData.networkers.length}</span> /{" "}
            <span className="total-networkers-count">
              {networkersData.totalCount}
            </span>{" "}
            Networkers
          </p>
        </div>
      </div>
    </section>
  );
};

export default NetworkerList;
