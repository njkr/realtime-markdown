"use client";
// components/SocketChat.tsx
import { useState, useEffect, useRef } from "react";
import IconButton from "@/components/IconButton";
import { Aperture, Keyboard, Mic } from "lucide-react";
import QASectionCard from "@/components/QASectionCard";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import AppNavbar from "@/components/AppNavbar";
import { useSocket } from "@/context/SocketContext";

type MessageStatus = "start" | "streaming" | "end";

type Data = {
  question?: string;
  id: string;
  type: "text" | "audio" | "record";
  content?: string;
  isError: boolean;
  status: MessageStatus;
  createdAt?: string;
};

type StreamData = {
  id: string;
  type?: "text" | "audio" | "record";
  question?: string;
  answer?: string;
  isStreaming: boolean;
  createdAt?: string;
};

type ActiveStream = Record<string, StreamData>;

const SocketChat = () => {
  const { socket } = useSocket();

  const [activeStream, setActiveStream] = useState<ActiveStream>({});

  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const upwardScrollDelta = useRef(0);
  const scrollThreshold = 30; // px to scroll up before showing navbar again

  useEffect(() => {
    // Connect to the server (Socket.IO defaults to localhost:3000)
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Scrolling down
      if (delta > 0) {
        if (currentY > 50) {
          setShowNavbar(false);
          upwardScrollDelta.current = 0;
        }
      }

      // Scrolling up
      else if (delta < 0) {
        upwardScrollDelta.current += Math.abs(delta);

        if (upwardScrollDelta.current > scrollThreshold) {
          setShowNavbar(true);
          upwardScrollDelta.current = 0;
        }
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup on unmount
    return () => {
      console.log("Socket disconnected on cleanup");
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("recording_event", (is_Recording: boolean) => {
      setIsRecording(is_Recording);
    });

    socket.on("stream_response", (data: Data) => {
      const { id, type, question, content, status, createdAt } = data;

      setActiveStream((prev) => {
        const existing = prev[id] || {};

        if (status === "start") {
          return {
            ...prev,
            [id]: {
              id,
              type,
              question,
              answer: "",
              isStreaming: true,
              createdAt,
            },
          };
        }

        if (status === "streaming") {
          return {
            ...prev,
            [id]: {
              ...existing,
              answer: (existing.answer || "") + (content || ""),
              isStreaming: true,
            },
          };
        }

        if (status === "end") {
          return {
            ...prev,
            [id]: {
              ...existing,
              isStreaming: false,
            },
          };
        }

        return prev;
      });
    });
  }, [socket]);

  const sendMessage = () => {
    if (socket) {
      // setMarkdown("");
      socket.emit("take_screenshot");
    }
  };

  const handleRecording = () => {
    if (socket) {
      socket.emit("recording_event_client", !isRecording);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-200">
      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <AppNavbar />
      </div>
      {/* Scrollable QA Content */}
      <div className="pt-[64px] flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {Object.entries(activeStream).map(([id, data]) => (
          <QASectionCard
            key={id}
            id={id}
            question={data.question || ""}
            answer={data.answer || ""}
            onDelete={() => setOpenDeleteId(id)}
            onEdit={() => console.log("Edit clicked")}
            isStreaming={data.isStreaming}
            createdAt={data.createdAt}
            type={data.type}
          />
        ))}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="h-20 flex items-center justify-evenly gap-4 bg-gray-900 px-6 py-4 border-t border-gray-700">
        <IconButton
          icon={Aperture}
          onClick={sendMessage}
          variant="secondary"
          size="medium"
        />
        <IconButton
          icon={Mic}
          onClick={handleRecording}
          variant="secondary"
          size="medium"
          glow={isRecording}
        />
        <IconButton
          icon={Keyboard}
          onClick={() => console.log("Typing...")}
          variant="secondary"
          size="medium"
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={openDeleteId !== null}
        onClose={() => setOpenDeleteId(null)}
        onDelete={() => {
          setActiveStream((prev) => {
            const newState = { ...prev };
            delete newState[openDeleteId as string];
            return newState;
          });
          setOpenDeleteId(null);
        }}
      />
    </div>
  );
};

export default SocketChat;
