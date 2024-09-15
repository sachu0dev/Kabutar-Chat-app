import React, { createContext, useMemo, useContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

const getSocket = (): Socket | null => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useMemo(() => {
    const socketInstance = io("https://kabutar-chat-server.onrender.com", {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to the server");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Connection Error:", error);
    });

    return socketInstance;
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { getSocket, SocketProvider };
