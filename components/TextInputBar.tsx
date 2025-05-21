// components/TextInputBar.tsx
import { useState } from "react";
import { Send, X } from "lucide-react";
import { motion } from "framer-motion";
import IconButton from "./IconButton";

interface TextInputBarProps {
  onSend: (text: string) => void;
  onCancel: () => void;
}

const TextInputBar = ({ onSend, onCancel }: TextInputBarProps) => {
  const [text, setText] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="h-20 flex items-center justify-between gap-2 bg-gray-900 px-6 py-4 border-t border-gray-700"
    >
      <input
        className="flex-1 rounded-md bg-gray-800 px-4 py-2 text-sm text-white focus:outline-none"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
      <div className="flex gap-2">
        <IconButton
          icon={X}
          onClick={() => {
            setText("");
            onCancel();
          }}
          variant="secondary"
          size="medium"
        />
        <IconButton
          icon={Send}
          onClick={() => {
            if (text.trim()) {
              onSend(text.trim());
              setText("");
            }
          }}
          variant="secondary"
          size="medium"
        />
      </div>
    </motion.div>
  );
};

export default TextInputBar;
