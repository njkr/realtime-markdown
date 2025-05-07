"use client";
// components/SocketChat.tsx
import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import IconButton from "@/components/IconButton";
import { Aperture, AudioLines, Keyboard } from "lucide-react";
import useSlideFromTop from "@/hooks/useSlideFromTop";
import { renderMarkdown } from '@/lib/markdown';

type Data = {
  markdownResponse: string;
  isError: boolean;
};

const SocketChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [markdown, setMarkdown] = useState(``);

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
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
      />
      </div>

      <input
        type="text"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Type your message here..."
      />

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
        <IconButton
          icon={Keyboard}
          onClick={() => {
            setMarkdown(
              `I am a Full Stack Developer with over 7 years of experience, specializing in AI integrations, LLMs, and automation. I have hands-on experience with LangChain, OpenAI API, TensorFlow, and PyTorch, and I’ve worked extensively on developing AI-driven workflows, integrating APIs, and optimizing business operations using AI agents. My expertise also includes vector databases, RAG (Retrieval-Augmented Generation), and cloud-based AI deployments (AWS, Azure, GCP).\nIn my recent projects, I have developed autonomous content creation pipelines using AI and automated real-time business insights with NLP-powered AI models. My strong background in Python, API development, and AI orchestration makes me confident in contributing to ASTUDIO’s mission of building intelligent AI agents.`
            );
          }}
          variant="secondary"
          size="small"
        />
      </div>
    </div>
  );
};

export default SocketChat;
