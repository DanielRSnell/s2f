import React from 'react';
import { FaTimes, FaHome, FaComments } from 'react-icons/fa';

interface ModalHeaderProps {
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => {
  return (
    <div className="bg-tertiary text-white p-4 rounded-t-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute right-0 top-1/2 w-32 h-32 transform translate-x-4 -translate-y-1/2 flex items-center justify-center">
          <FaHome 
            size={80} 
            className="text-white"
          />
        </div>
      </div>
      
      {/* Header Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-90 mb-1">
              STREET2FLEET SCHEDULING
            </p>
            <h2 className="text-xl font-bold text-white">
              Book Online Now
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-2"
            aria-label="Close modal"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <FaComments className="text-white opacity-95" size={16} />
          <p className="text-sm opacity-95">
            Let us help you today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModalHeader;