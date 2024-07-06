import React, { createContext, useMemo, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const getSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    const socketInstance = io("http://localhost:3000", {
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
