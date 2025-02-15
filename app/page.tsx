"use client";
// components/SocketChat.tsx
import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import ReactMarkdown from "react-markdown";
import IconButton from "@/components/IconButton";
import { Aperture, AudioLines, Keyboard } from "lucide-react";
import useSlideFromTop from "@/hooks/useSlideFromTop";

type Data = {
  markdownResponse: string;
  isError: boolean;
};

const SocketChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [markdown, setMarkdown] = useState("");

  const { toggleSlide, SlideComponent } = useSlideFromTop({
    height: 200,
    duration: 0.5,
  });

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
      // alert(error);
      console.log("Error connecting to server", error);
    });

    // Handle socket disconnection event
    socketIo.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socketIo.on("markdown_response", (data: Data) => {
      setMarkdown(data.markdownResponse.slice(3, -3));
    });

    socketIo.on("recording", () => {
      toggleSlide();
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
      <SlideComponent />
      {/* First Div - Takes remaining space */}
      <div className="flex-1 overflow-auto p-4">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>

      {/* Second Div - Fixed Height */}
      <div className="h-20 flex items-center justify-between gap-4 bg-gray-700 px-12 py-8 border-t-2 border-gray-600">
        <IconButton
          icon={Aperture}
          onClick={sendMessage}
          variant="secondary"
          size="small"
        />
        <IconButton
          icon={AudioLines}
          onClick={toggleSlide}
          variant="secondary"
          size="small"
        />
        <IconButton icon={Keyboard} variant="secondary" size="small" />
      </div>
    </div>
  );
};

export default SocketChat;
