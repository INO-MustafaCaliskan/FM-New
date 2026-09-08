import { createContext, useContext, useState } from "react";

const AgoraContext = createContext();

export const AgoraProvider = ({ children }) => {
    const [client, setClient] = useState(null);
    const [localTracks, setLocalTracks] = useState([]);
    const [remoteUsers, setRemoteUsers] = useState([]);

    const value = {
        client,
        setClient,
        localTracks,
        setLocalTracks,
        remoteUsers,
        setRemoteUsers,
    };

    return <AgoraContext.Provider value={value}>{children}</AgoraContext.Provider>;
};

export const useAgora = () => useContext(AgoraContext);
