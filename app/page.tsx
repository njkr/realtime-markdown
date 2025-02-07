"use client";
// components/SocketChat.tsx
import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import ReactMarkdown from "react-markdown";

type Data = {
  markdownResponse: string;
  isError: boolean;
};

const SocketChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    // Connect to the server (Socket.IO defaults to localhost:3000)

    const socketIo = io(
      (process.env.NEXT_PUBLIC_SOCKET_SERVER_URL as string) ||
        "http://localhost:3000",
      {
        transports: ["websocket"], // Force WebSocket
      }
    );

    // Save the socket instance
    setSocket(socketIo);

    // Listen for messages from the server
    socketIo.on("receiveMessage", (newMessage: string) => {
      console.log("newMessage", newMessage);
    });

    // Handle socket connection event
    socketIo.on("connect", () => {
      console.log("Connected to server");
    });

    // Handle socket error event
    socketIo.on("connect_error", (error: Error) => {
      alert(error);
      console.log("Error connecting to server", error);
    });

    // Handle socket disconnection event
    socketIo.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socketIo.on("markdown_response", (data: Data) => {
      setMarkdown(data.markdownResponse.slice(3, -3));
    });

    // Cleanup on unmount
    return () => {
      socketIo.disconnect();
      console.log("Socket disconnected on cleanup");
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      setMarkdown("");
      socket.emit("get_answer", "hello");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* First Div - Takes remaining space */}
      <div className="flex-1 overflow-auto p-4">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>

      {/* Second Div - Fixed Height */}
      <div className="h-16 bg-gray-800 text-white flex justify-left">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={sendMessage}
        >
          get answer
        </button>
      </div>
    </div>
  );
};

export default SocketChat;
