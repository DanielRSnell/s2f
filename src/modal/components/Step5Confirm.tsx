import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaCheck } from 'react-icons/fa';
import type { ServiceCategory, ServiceSpecific, TimeSlot, ContactInfo } from '@/modal/types/booking';

interface Step5ConfirmProps {
  location: string;
  selectedCategory: ServiceCategory | null;
  selectedSpecific: ServiceSpecific | null;
  equipmentAge: string;
  selectedTimeSlot: TimeSlot | null;
  contactInfo: ContactInfo;
  onEditLocation: () => void;
  onEditServices: () => void;
  onEditScheduling: () => void;
  onEditContact: () => void;
}

const Step5Confirm: React.FC<Step5ConfirmProps> = ({
  location,
  selectedCategory,
  selectedSpecific,
  equipmentAge,
  selectedTimeSlot,
  contactInfo,
  onEditLocation,
  onEditServices,
  onEditScheduling,
  onEditContact
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

  const getEquipmentAgeLabel = (age: string) => {
    const ageLabels = {
      'new': 'Less than 5 Years Old',
      'medium': '5-10 Years Old',
      'old': '10+ Years Old',
      'unknown': 'Not Sure'
    };
    return ageLabels[age as keyof typeof ageLabels] || age;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-tertiary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheck className="text-white text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-text-dark mb-2">
          Confirm Your Booking
        </h3>
        <p className="text-text text-sm">
          Please review your booking details before confirming
        </p>
      </div>

      {/* Location */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-tertiary" size={16} />
            <span className="font-semibold text-text-dark">Service Location</span>
          </div>
          <button
            onClick={onEditLocation}
            className="text-tertiary hover:text-secondary transition-colors duration-200"
          >
            <FaEdit size={14} />
          </button>
        </div>
        <p className="text-text-dark">{location}</p>
      </div>

      {/* Service Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-tertiary" size={16} />
            <span className="font-semibold text-text-dark">Service Details</span>
          </div>
          <button
            onClick={onEditServices}
            className="text-tertiary hover:text-secondary transition-colors duration-200"
          >
            <FaEdit size={14} />
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-text-dark font-medium">{selectedCategory?.name}</p>
          {selectedSpecific && (
            <div className="flex flex-wrap gap-2">
              <span className="bg-tertiary/20 text-tertiary px-2 py-1 rounded text-sm">
                {selectedSpecific.name}
              </span>
              {equipmentAge && (
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                  {getEquipmentAgeLabel(equipmentAge)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Time */}
      {selectedTimeSlot && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-tertiary" size={16} />
              <span className="font-semibold text-text-dark">Appointment Time</span>
            </div>
            <button
              onClick={onEditScheduling}
              className="text-tertiary hover:text-secondary transition-colors duration-200"
            >
              <FaEdit size={14} />
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-text-dark font-medium">
              {formatDate(selectedTimeSlot.date)}
            </p>
            <p className="text-text">
              {formatTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}
            </p>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaUser className="text-tertiary" size={16} />
            <span className="font-semibold text-text-dark">Contact Information</span>
          </div>
          <button
            onClick={onEditContact}
            className="text-tertiary hover:text-secondary transition-colors duration-200"
          >
            <FaEdit size={14} />
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-text-dark font-medium">
            {contactInfo.firstName} {contactInfo.lastName}
          </p>
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-400" size={12} />
            <span className="text-text text-sm">{contactInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-400" size={12} />
            <span className="text-text text-sm">{contactInfo.email}</span>
          </div>
          {contactInfo.receiveTexts && (
            <p className="text-tertiary text-sm">✓ Will receive text message updates</p>
          )}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Please note:</strong> A service technician will contact you within 24 hours to confirm your appointment and provide any additional details.
        </p>
      </div>
    </div>
  );
};

export default Step5Confirm;