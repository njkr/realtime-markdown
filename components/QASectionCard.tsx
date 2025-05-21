"use client";
import { renderMarkdown } from "@/lib/markdown";
import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  CheckCircle,
  Loader2,
  Text,
  Mic,
  FileText,
} from "lucide-react";
import EditableQuestion from "./EditableQuestion";
import { useSocket } from "@/context/SocketContext";

interface QASectionCardProps {
  id: string;
  question: string;
  answer: string;
  onEdit?: () => void;
  onDelete: () => void;
  type?: "text" | "audio" | "record";
  createdAt?: string;
  isStreaming?: boolean;
}

const typeIconMap = {
  text: Text,
  audio: Mic,
  record: FileText,
};

const QASectionCard: React.FC<QASectionCardProps> = ({
  id,
  question,
  answer,
  onDelete,
  type = "audio",
  createdAt = "12:00 PM",
  isStreaming = true,
}) => {
  const { socket } = useSocket();
  const [localQuestion, setLocalQuestion] = useState(question);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const TypeIcon = typeIconMap[type] || Text;

  const handleOnSend = (newVal: string): void => {
    setLocalQuestion(newVal);
    setIsEditingQuestion(false);
    if (socket) {
      socket.emit("streaming_event", { text: newVal, type, id });
    }
  };

  return (
    <div className="m-2">
      <div className="w-full max-w-full rounded-xl bg-white p-4 text-sm text-gray-800 shadow dark:bg-gray-900 dark:text-gray-200">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <TypeIcon className="h-4 w-4" />
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            {createdAt && <span className="ml-2">• {createdAt}</span>}
          </div>
          <div className="flex gap-2">
            {!isStreaming && (
              <button
                className="text-gray-400 hover:text-blue-500"
                onClick={() => setIsEditingQuestion(true)}
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button
              className="text-gray-400 hover:text-red-500"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Question Section */}
        <EditableQuestion
          value={localQuestion}
          isEditing={isEditingQuestion}
          onEditCancel={() => setIsEditingQuestion(false)}
          onSend={handleOnSend}
        />

        {/* Answer Section */}
        <div>
          <div className="flex items-center gap-1 mb-2 font-medium">
            {isStreaming ? (
              <Loader2 className="h-4 w-4 text-green-500 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            <span>Answer</span>
          </div>

          <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-3 overflow-x-auto">
            <div
              className="prose dark:prose-invert max-w-none text-xs"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(answer) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QASectionCard;
