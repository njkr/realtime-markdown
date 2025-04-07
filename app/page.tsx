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
        <IconButton
          icon={Keyboard}
          onClick={() => {
            setMarkdown(
              `I'm Jenkins Raj, a Full Stack Web Developer with over 7 years of experience, primarily focused on the MERN stack and modern fintech and Web3 technologies. Currently, I’m working at Skyland Technology in Dubai, where I’ve been leading development on metaverse and NFT-related projects using NestJS, Next.js, and AWS, while also integrating AI and blockchain components like ERC20/721 smart contracts and real-time WebSocket communication.
              /n Before that, I developed mission-critical systems like Warehouse Management and POS platforms at Brands for Less, leveraging technologies such as NestJS, React, MongoDB, and Docker. I also introduced AI-powered forecasting and Power BI dashboards to enhance business decision-making.
              /n I have extensive experience building secure, scalable backends with Node.js and Express, and responsive frontends using Next.js and Tailwind. I’ve integrated major payment gateways, worked with real-time systems, deployed CI/CD pipelines using GitHub Actions, and even implemented AI/ML models using FastAPI and TensorFlow.
              /n What excites me most about the role at HRA Web3 is the opportunity to combine my fintech, Web3, and full stack skills to build scalable, secure global payment solutions through platforms like HRA ePay. I’m especially interested in the integration with Stripe, crypto wallets, and card issuing APIs like Wallester—areas I’ve already worked in or am passionate about exploring further.`
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
