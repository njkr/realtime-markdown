// context/SocketContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(
      process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3000",
      {
        transports: ["websocket"],
      }
    );

    setSocket(socketIo);

    socketIo.on("connect", () => {
      console.log("Connected to server");
    });

    socketIo.on("connect_error", (error: Error) => {
      console.error("Error connecting to server", error);
    });

    socketIo.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socketIo.disconnect();
      console.log("Socket disconnected on cleanup");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
