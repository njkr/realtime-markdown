// components/DynamicIsland.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DynamicIsland: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dynamicContent, setDynamicContent] = useState<string | null>(null);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const showContent = (content: string) => {
    setDynamicContent(content);
    setIsExpanded(true);
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-900">
      {/* Trigger Buttons */}
      <div className="absolute top-10 flex gap-4">
        <button
          onClick={() => showContent("🔔 New Notification!")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Show Notification
        </button>
        <button
          onClick={() => showContent("🎵 Now Playing: Chill Vibes")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Show Music
        </button>
        <button
          onClick={() => showContent("📞 Incoming Call")}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Show Call
        </button>
        <button
          onClick={toggleExpand}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {/* Dynamic Island */}
      <motion.div
        initial={{ width: 100, height: 40, borderRadius: 9999 }}
        animate={{
          width: isExpanded ? 320 : 100,
          height: isExpanded ? 90 : 40,
          borderRadius: isExpanded ? 20 : 9999,
        }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.6,
        }}
        className={`bg-black text-white flex items-center justify-center shadow-lg 
          ${isExpanded ? "neon-glow" : "neon-glow-small"}`}
        onClick={toggleExpand}
      >
        <AnimatePresence>
          {dynamicContent ? (
            <motion.div
              key={dynamicContent}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="px-4 text-center text-lg font-semibold"
            >
              {dynamicContent}
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="px-4 text-center text-lg"
            >
              Dynamic Island
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DynamicIsland;
