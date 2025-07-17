import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaArrowLeft } from 'react-icons/fa';
import { useKeyboardShortcut } from '@/modal/hooks/useKeyboardShortcut';
import type { BookingData, ContactInfo, ModalSteps } from '@/modal/types/booking';
import ModalHeader from '@/modal/components/ModalHeader';
import Step1Location from '@/modal/components/Step1Location';
import Step2Services from '@/modal/components/Step2Services';
import Step3Scheduling from '@/modal/components/Step3Scheduling';
import Step4Contact from '@/modal/components/Step4Contact';
import Step5Confirm from '@/modal/components/Step5Confirm';
import Step6Success from '@/modal/components/Step6Success';
import { validateZipCode } from '@/modal/utils/mockData';

// Extend Window interface for Voiceflow
declare global {
  interface Window {
    voiceflow: {
      chat: {
        load: (config: any) => void;
      };
    };
  }
}

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<ModalSteps>(1);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [showChat, setShowChat] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    zipCode: '',
    location: '',
    serviceCategory: null,
    serviceType: null,
    specificService: null,
    equipmentAge: '',
    timeSlot: null,
    contactInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      receiveTexts: false
    },
    isEmergency: false
  });

  // Close modal with Escape key
  useKeyboardShortcut(
    { key: 'Escape' },
    () => {
      if (isOpen) {
        onClose();
      }
    }
  );

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    // Reset form after a brief delay
    setTimeout(() => {
      setCurrentStep(1);
      setValidationError('');
      setIsValidating(false);
      setShowChat(false);
      setBookingData({
        zipCode: '',
        location: '',
        serviceCategory: null,
        serviceType: null,
        specificService: null,
        equipmentAge: '',
        timeSlot: null,
        contactInfo: {
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          receiveTexts: false
        },
        isEmergency: false
      });
    }, 300);
  };

  const handleChatToggle = () => {
    setShowChat(!showChat);
  };

  // Use effect to load Voiceflow every time chat tab becomes active
  useEffect(() => {
    if (showChat) {
      console.log('Chat tab is now active, loading Voiceflow...');
      // Wait longer for DOM to be ready, then load Voiceflow
      const timer = setTimeout(() => {
        const targetElement = document.querySelector('#example-vf');
        console.log('Target element found:', targetElement);
        if (targetElement) {
          console.log('Running Voiceflow initialization...');
          loadVoiceflow();
        } else {
          console.error('Target element #example-vf not found');
        }
      }, 500); // Increased delay to ensure DOM is ready
      
      return () => clearTimeout(timer);
    }
  }, [showChat]);

  const loadVoiceflow = () => {
    (function(d, t) {
      var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
      v.onload = function() {
        console.log('Voiceflow script loaded, initializing chat...');
        window.voiceflow.chat.load({
          verify: { projectID: '686ff84f7f5efc148cd1149d' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          voice: {
            url: "https://runtime-api.voiceflow.com"
          },
          render: {
            mode: 'embedded',
            target: document.querySelector('#example-vf')
          }
        });
      };
      v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; 
      v.type = "text/javascript"; 
      s.parentNode.insertBefore(v, s);
    })(document, 'script');
  };

  const handleBackToBooking = () => {
    setShowChat(false);
  };

  const handleZipCodeChange = (zipCode: string) => {
    const validation = validateZipCode(zipCode);
    setBookingData(prev => ({
      ...prev,
      zipCode,
      location: validation.location || ''
    }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as ModalSteps);
    }
  };

  const handleStep1Confirm = () => {
    if (bookingData.zipCode.length !== 5) {
      setValidationError('Please enter a valid 5-digit zip code');
      return;
    }

    setIsValidating(true);
    setValidationError('');
    
    // Simulate API call
    setTimeout(() => {
      const validation = validateZipCode(bookingData.zipCode);
      
      if (validation.valid && validation.inServiceArea) {
        setBookingData(prev => ({
          ...prev,
          location: validation.location || ''
        }));
        handleNext();
      } else {
        setValidationError(validation.message);
      }
      
      setIsValidating(false);
    }, 500);
  };

  const canContinueStep2 = () => {
    return bookingData.serviceCategory && 
           bookingData.serviceType && 
           (bookingData.serviceType.id === 'estimate' || 
            (bookingData.specificService && 
             (bookingData.serviceCategory.id !== 'hvac' || bookingData.equipmentAge)));
  };

  const canContinueStep3 = () => {
    return bookingData.timeSlot !== null;
  };

  const canContinueStep4 = () => {
    return bookingData.contactInfo.firstName && 
           bookingData.contactInfo.lastName && 
           bookingData.contactInfo.phone && 
           bookingData.contactInfo.email;
  };

  const handleEmergency = () => {
    setBookingData(prev => ({
      ...prev,
      isEmergency: true
    }));
    // In a real app, this would redirect to emergency booking flow
    alert('Emergency booking would be handled here');
  };

  const handleSubmit = () => {
    // In a real app, this would submit to API
    console.log('Booking submitted:', bookingData);
    alert('Booking submitted successfully! (This is a demo)');
    handleClose();
  };

  const handleEditLocation = () => {
    setCurrentStep(1);
  };

  const handleEditSummary = () => {
    setCurrentStep(2);
  };

  const handleEditServices = () => {
    setCurrentStep(2);
  };

  const handleEditScheduling = () => {
    setCurrentStep(3);
  };

  const handleEditContact = () => {
    setCurrentStep(4);
  };

  const handleConfirmBooking = () => {
    // In a real app, this would submit to API
    console.log('Final booking submitted:', bookingData);
    handleNext(); // Go to success screen
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal positioned in bottom-right */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute bottom-6 right-6 bg-white rounded-2xl shadow-2xl w-96 max-h-[80vh] h-[700px] overflow-hidden border border-gray-200 flex flex-col"
            style={{ transformOrigin: 'bottom right' }}
          >
            {/* Header */}
            {showChat ? (
              <div className="bg-white border-b border-gray-200 p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBackToBooking}
                      className="text-tertiary hover:text-secondary transition-colors duration-200"
                    >
                      <FaArrowLeft size={16} />
                    </button>
                    <div className="flex items-center gap-2">
                      <FaComments className="text-tertiary" size={16} />
                      <span className="text-text-dark font-medium">Chat with us</span>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : (
              currentStep !== 6 && <ModalHeader onClose={handleClose} />
            )}
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {showChat ? (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full"
                  >
                    <div id="example-vf" className="h-full w-full" />
                  </motion.div>
                ) : (
                  <>
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <Step1Location
                          zipCode={bookingData.zipCode}
                          onZipCodeChange={handleZipCodeChange}
                          onNext={handleNext}
                          onCancel={handleClose}
                          validationError={validationError}
                          isValidating={isValidating}
                        />
                      </motion.div>
                    )}
                    
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <Step2Services
                          location={bookingData.location}
                          selectedCategory={bookingData.serviceCategory}
                          selectedType={bookingData.serviceType}
                          selectedSpecific={bookingData.specificService}
                          equipmentAge={bookingData.equipmentAge}
                          onCategorySelect={(category) => setBookingData(prev => ({
                            ...prev,
                            serviceCategory: category,
                            serviceType: null,
                            specificService: null
                          }))}
                          onTypeSelect={(type) => setBookingData(prev => ({
                            ...prev,
                            serviceType: type,
                            specificService: null
                          }))}
                          onSpecificSelect={(specific) => setBookingData(prev => ({
                            ...prev,
                            specificService: specific
                          }))}
                          onEquipmentAgeSelect={(age) => setBookingData(prev => ({
                            ...prev,
                            equipmentAge: age
                          }))}
                          onNext={handleNext}
                          onEmergency={handleEmergency}
                          onEditLocation={handleEditLocation}
                        />
                      </motion.div>
                    )}
                    
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <Step3Scheduling
                          location={bookingData.location}
                          selectedCategory={bookingData.serviceCategory}
                          selectedSpecific={bookingData.specificService}
                          equipmentAge={bookingData.equipmentAge}
                          selectedTimeSlot={bookingData.timeSlot}
                          onTimeSlotSelect={(timeSlot) => setBookingData(prev => ({
                            ...prev,
                            timeSlot
                          }))}
                          onNext={handleNext}
                          onEmergency={handleEmergency}
                          onEditSummary={handleEditSummary}
                        />
                      </motion.div>
                    )}
                    
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <Step4Contact
                          location={bookingData.location}
                          selectedCategory={bookingData.serviceCategory}
                          selectedSpecific={bookingData.specificService}
                          equipmentAge={bookingData.equipmentAge}
                          selectedTimeSlot={bookingData.timeSlot}
                          contactInfo={bookingData.contactInfo}
                          onContactInfoChange={(contactInfo) => setBookingData(prev => ({
                            ...prev,
                            contactInfo
                          }))}
                          onSubmit={handleSubmit}
                          onEditSummary={handleEditSummary}
                        />
                      </motion.div>
                    )}

                    {currentStep === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <Step5Confirm
                          location={bookingData.location}
                          selectedCategory={bookingData.serviceCategory}
                          selectedSpecific={bookingData.specificService}
                          equipmentAge={bookingData.equipmentAge}
                          selectedTimeSlot={bookingData.timeSlot}
                          contactInfo={bookingData.contactInfo}
                          onEditLocation={handleEditLocation}
                          onEditServices={handleEditServices}
                          onEditScheduling={handleEditScheduling}
                          onEditContact={handleEditContact}
                        />
                      </motion.div>
                    )}

                    {currentStep === 6 && (
                      <motion.div
                        key="step6"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <Step6Success
                          location={bookingData.location}
                          selectedCategory={bookingData.serviceCategory}
                          selectedSpecific={bookingData.specificService}
                          selectedTimeSlot={bookingData.timeSlot}
                          contactInfo={bookingData.contactInfo}
                          onClose={handleClose}
                        />
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
            
            {/* Footer - Only show for booking mode */}
            {!showChat && (
              <div className="border-t border-gray-200 bg-white rounded-b-2xl">
                {/* Have Questions Button */}
                <div className="p-3 border-b border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.1 }}
                    onClick={handleChatToggle}
                    className="w-full flex items-center justify-center gap-2 py-2 text-tertiary hover:text-secondary transition-colors duration-200 font-medium text-sm"
                  >
                    <FaComments size={14} />
                    Have Questions?
                  </motion.button>
                </div>
                
                {/* Action Buttons */}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    {/* Emergency Button (hidden on success screen) */}
                    {currentStep !== 6 && (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ duration: 0.1 }}
                        onClick={handleEmergency}
                        className="text-red-500 hover:text-red-600 transition-colors font-medium text-sm"
                      >
                        🚨 Emergency
                      </motion.button>
                    )}
                    
                    {/* Spacer for success screen */}
                    {currentStep === 6 && <div></div>}
                    
                    {/* Step Action Buttons */}
                    <div className="flex gap-3">
                      {currentStep === 1 && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ duration: 0.1 }}
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-200 text-text-dark rounded-lg hover:bg-gray-300 transition-colors text-sm"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ duration: 0.1 }}
                            onClick={handleStep1Confirm}
                            disabled={isValidating || !bookingData.zipCode || bookingData.zipCode.length !== 5}
                            className="px-4 py-2 bg-tertiary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {isValidating ? (
                              <div className="flex items-center gap-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                  className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                                />
                                Checking...
                              </div>
                            ) : (
                              'Confirm'
                            )}
                          </motion.button>
                        </>
                      )}
                      
                      {currentStep === 2 && (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ duration: 0.1 }}
                          onClick={handleNext}
                          disabled={!canContinueStep2()}
                          className="px-4 py-2 bg-tertiary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Continue Booking
                        </motion.button>
                      )}
                      
                      {currentStep === 3 && (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ duration: 0.1 }}
                          onClick={handleNext}
                          disabled={!canContinueStep3()}
                          className="px-4 py-2 bg-tertiary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Continue Booking
                        </motion.button>
                      )}
                      
                      {currentStep === 4 && (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ duration: 0.1 }}
                          onClick={handleNext}
                          disabled={!canContinueStep4()}
                          className="px-4 py-2 bg-tertiary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Continue
                        </motion.button>
                      )}

                      {currentStep === 5 && (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ duration: 0.1 }}
                          onClick={handleConfirmBooking}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Confirm Booking
                        </motion.button>
                      )}

                      {currentStep === 6 && (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ duration: 0.1 }}
                          onClick={handleClose}
                          className="px-6 py-2 bg-tertiary text-white rounded-lg hover:bg-secondary transition-colors text-sm"
                        >
                          Close
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureModal;