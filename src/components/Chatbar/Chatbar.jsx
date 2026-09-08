"use client";
import React, { useEffect, useRef } from "react";
import "./Chatbar.css";
import { Chatbox } from "./Chatbox";
import { useSignalR } from "@/context/SignalRContext2";

export const Chatbar = () => {
  const firstInit = useRef(true);
  const {
    connection,
    loadChatBoxes,
    refreshChatBoxStatus,
    chatBoxes,
    setComponent,
    getPendingChatBoxes,
    pendingQuickChatUsers,
  } = useSignalR();

  useEffect(() => {
    async function fetchConversations() {
      const cbs = await loadChatBoxes();
      await refreshChatBoxStatus(cbs.map(cb => cb.user.id));
    }

    if (connection && connection.state == "Connected" && firstInit.current) {
      setComponent("chatbar");
      fetchConversations();
      firstInit.current = false;
    }
  }, [connection, loadChatBoxes, setComponent, refreshChatBoxStatus]);

  useEffect(() => {
    if (pendingQuickChatUsers.length > 0) getPendingChatBoxes();
  }, [pendingQuickChatUsers, getPendingChatBoxes]);

  if (connection === null || connection.state !== "Connected")
    return;

  return (
    <div className="chatbox-holder">
      {chatBoxes.map((chatBoxData, index) => {
        return <Chatbox key={chatBoxData.user.id} chatBoxData={chatBoxData} />;
      })}
    </div>
  );
};
