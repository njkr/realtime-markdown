import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioLines } from "lucide-react";

const useSlideFromTop = ({ height = 200, duration = 0.5 }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleSlide = () => setIsVisible((prev) => !prev);

  const SlideComponent = () => (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -height }}
          animate={{ y: 0 }}
          exit={{ y: -height, opacity: 0 }}
          transition={{ duration }}
          className="relative w-full px-12  top-14 "
        >
          <div className="h-14 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-lg"></div>
          <div className="h-14 rounded-2xl relative space-x-6 px-7 flex items-center justify-left bg-gray-900 top-[-50%]">
            <AudioLines />
            <h3>Recording</h3>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { isVisible, toggleSlide, SlideComponent };
};

export default useSlideFromTop;
