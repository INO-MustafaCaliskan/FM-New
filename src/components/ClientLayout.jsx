'use client';

import UserHeader from '@/components/Header/UserHeader';
import Footer from './Footer/Footer';
import { Chatbar } from './Chatbar/Chatbar';
import { usePathname } from 'next/navigation';
import { NotificationProvider } from '@/context/NotificationContext';
import { PendingRequestProvider } from '@/context/PendingRequestContext';
import { SignalRProvider } from '@/context/SignalRContext2';
import { useCallNavigation } from '@/utils/hooks/useCallNavigation';
import { useUser } from '@/context/UserContext';
import { useEffect } from 'react';
import { useMeetingStore } from '@/context/MeetingContext';
import CallModalShell from './CallModals/CallModalShell';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const { token, sessionId } = useUser();
  const connect = useMeetingStore((state) => state.connect);
  const disconnect = useMeetingStore((state) => state.disconnect);
  useCallNavigation();

  const isMeetingPage = pathname.includes("/meeting-page");
  
  useEffect(() => {
    if (token && sessionId) {
      connect(token, sessionId);
    }else{
      disconnect();
    }

  }, [token, sessionId, connect, disconnect])

  if(isMeetingPage){
    return (
      <SignalRProvider>
        {children}
      </SignalRProvider>
    )
  }

  return (
    <>
      <SignalRProvider>
          <NotificationProvider>
            <PendingRequestProvider>
              <UserHeader />
              {
                !pathname.includes("chat") && <Chatbar />
              }
              <CallModalShell />
              {children}
              <Footer />
            </PendingRequestProvider>
          </NotificationProvider>
      </SignalRProvider>
    </>
  );
}
