import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCalendarAlt, FaPhone, FaEnvelope, FaTimes } from 'react-icons/fa';
import type { ServiceCategory, ServiceSpecific, TimeSlot, ContactInfo } from '@/modal/types/booking';

interface Step6SuccessProps {
  location: string;
  selectedCategory: ServiceCategory | null;
  selectedSpecific: ServiceSpecific | null;
  selectedTimeSlot: TimeSlot | null;
  contactInfo: ContactInfo;
  onClose: () => void;
}

const Step6Success: React.FC<Step6SuccessProps> = ({
  location,
  selectedCategory,
  selectedSpecific,
  selectedTimeSlot,
  contactInfo,
  onClose
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const generateBookingReference = () => {
    return `S2F-${Date.now().toString().slice(-6)}`;
  };

  return (
    <div className="p-4 text-center space-y-6">
      {/* Close Button */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>
      </div>
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="flex justify-center mb-6"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <FaCheckCircle className="text-green-600 text-3xl" />
        </div>
      </motion.div>

      {/* Success Message */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-text-dark">
          Booking Confirmed!
        </h3>
        <p className="text-text">
          Thank you {contactInfo.firstName}! Your service request has been successfully submitted.
        </p>
        
        {/* Booking Reference */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Booking Reference</p>
          <p className="font-mono font-bold text-lg text-tertiary">{generateBookingReference()}</p>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-tertiary/10 p-4 rounded-lg text-left space-y-3">
        <h4 className="font-semibold text-text-dark mb-3">Booking Summary</h4>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <FaCalendarAlt className="text-tertiary mt-1" size={14} />
            <div>
              <p className="font-medium text-text-dark">{selectedCategory?.name}</p>
              {selectedSpecific && (
                <p className="text-sm text-text">{selectedSpecific.name}</p>
              )}
            </div>
          </div>
          
          {selectedTimeSlot && (
            <div className="flex items-start gap-2">
              <FaCalendarAlt className="text-tertiary mt-1" size={14} />
              <div>
                <p className="text-sm text-text-dark">
                  {formatDate(selectedTimeSlot.date)}
                </p>
                <p className="text-sm text-text">
                  {formatTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <FaPhone className="text-tertiary" size={14} />
            <p className="text-sm text-text">{contactInfo.phone}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-tertiary" size={14} />
            <p className="text-sm text-text">{contactInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-left">
        <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• A technician will contact you within 24 hours</li>
          <li>• You'll receive a confirmation email shortly</li>
          <li>• We'll send reminders before your appointment</li>
          {contactInfo.receiveTexts && <li>• Text updates will be sent to your phone</li>}
        </ul>
      </div>

      {/* Contact Information */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Questions? Call us at{' '}
          <a href="tel:+1-800-STREET2" className="text-tertiary font-medium">
            1-800-STREET2
          </a>
        </p>
      </div>
    </div>
  );
};

export default Step6Success;