import React, { useState } from 'react';
import LeadCaptureModal from '@/modal/LeadCaptureModal';
import FloatingChatBubble from '@/modal/components/FloatingChatBubble';
import { useKeyboardShortcut } from '@/modal/hooks/useKeyboardShortcut';

// Global modal component that can be added to any page
const GlobalModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Keyboard shortcut to toggle modal (CMD+L)
  useKeyboardShortcut(
    { key: 'l', metaKey: true },
    () => {
      handleToggleModal();
    }
  );

  return (
    <>
      <FloatingChatBubble isOpen={isModalOpen} onClick={handleToggleModal} />
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default GlobalModal;