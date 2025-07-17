import React from 'react';
import { motion } from 'framer-motion';
import { FaComments, FaTimes } from 'react-icons/fa';

interface FloatingChatBubbleProps {
  isOpen: boolean;
  onClick: () => void;
}

const FloatingChatBubble: React.FC<FloatingChatBubbleProps> = ({ isOpen, onClick }) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.button
        onClick={onClick}
        className="relative bg-tertiary hover:bg-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: isOpen ? '60px' : '60px',
          height: isOpen ? '60px' : '60px',
        }}
      >
        {/* Pulsing animation when closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 bg-tertiary rounded-full opacity-20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        
        {/* Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        >
          {isOpen ? (
            <FaTimes size={24} />
          ) : (
            <FaComments size={24} />
          )}
        </motion.div>
        
        {/* Tooltip when closed */}
        {!isOpen && (
          <motion.div
            className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 0, x: 0 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            Book a Service
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
};

export default FloatingChatBubble;