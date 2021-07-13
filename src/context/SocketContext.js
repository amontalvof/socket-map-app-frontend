import React, { createContext } from 'react';
import useSocket from '../hooks/useSocket';

export const SocketContext = createContext();

const backendUrl =
    process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_BACKEND_PRODUCTION_URL
        : process.env.REACT_APP_BACKEND_DEVELOPMENT_URL;

export const SocketProvider = ({ children }) => {
    const { socket, online } = useSocket(backendUrl);
    return (
        <SocketContext.Provider value={{ socket, online }}>
            {children}
        </SocketContext.Provider>
    );
};
