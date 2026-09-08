"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import client from "@/utils/client";

const PendingRequestContext = createContext({
  pendingCount: 0,
  decreaseCount: () => {},
  refreshCount: () => {},
});

export const usePendingRequestContext = () => useContext(PendingRequestContext);

export const PendingRequestProvider = ({ children }) => {
  const [pendingCount, setPendingCount] = useState(0);

  const refreshCount = useCallback(async () => {
    try {
      const response = await client.get("/NetworkConnection/PendingRequestCount");
      if (response.data?.success && response.data?.data > 0) {
        setPendingCount(response.data.data);
      } else {
        setPendingCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch pending request count:", error);
    }
  }, []);

  const decreaseCount = useCallback(() => {
    setPendingCount((prev) => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return (
    <PendingRequestContext.Provider value={{ pendingCount, decreaseCount, refreshCount }}>
      {children}
    </PendingRequestContext.Provider>
  );
};
