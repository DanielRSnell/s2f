import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaClock, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import type { ServiceCategory, ServiceSpecific, TimeSlot, ContactInfo } from '@/modal/types/booking';

interface Step4ContactProps {
  location: string;
  selectedCategory: ServiceCategory | null;
  selectedSpecific: ServiceSpecific | null;
  equipmentAge: string;
  selectedTimeSlot: TimeSlot | null;
  contactInfo: ContactInfo;
  onContactInfoChange: (info: ContactInfo) => void;
  onSubmit: () => void;
  onEditSummary: () => void;
}

const Step4Contact: React.FC<Step4ContactProps> = ({
  location,
  selectedCategory,
  selectedSpecific,
  equipmentAge,
  selectedTimeSlot,
  contactInfo,
  onContactInfoChange,
  onSubmit,
  onEditSummary
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!contactInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!contactInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!contactInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(contactInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!contactInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  const handleInputChange = (field: keyof ContactInfo, value: string | boolean) => {
    onContactInfoChange({
      ...contactInfo,
      [field]: value
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const length = numbers.length;
    
    if (length <= 3) {
      return numbers;
    } else if (length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    handleInputChange('phone', formatted);
  };

  return (
    <div className="p-6">
      {/* Summary Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-text-dark">SUMMARY</h3>
          <button
            onClick={onEditSummary}
            className="text-tertiary hover:text-secondary transition-colors duration-200"
          >
            <FaEdit size={16} />
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <FaUser className="text-tertiary" size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-text-dark mb-1">
                {selectedCategory?.name}
              </h4>
              <div className="text-sm text-text space-y-1">
                {selectedSpecific && (
                  <span className="bg-gray-200 px-2 py-1 rounded mr-2">
                    {selectedSpecific.name}
                  </span>
                )}
                {equipmentAge && (
                  <span className="bg-gray-200 px-2 py-1 rounded mr-2">
                    {getEquipmentAgeLabel(equipmentAge)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        {selectedTimeSlot && (
          <div className="flex items-center gap-2 text-text-dark mb-2">
            <FaClock className="text-tertiary" size={16} />
            <span>
              {formatDate(selectedTimeSlot.date)}, {formatTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-text-dark">
          <FaMapMarkerAlt className="text-tertiary" size={16} />
          <span>{location}</span>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-text-dark mb-6">
          Contact Info
        </h3>

        <div className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-dark font-medium mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactInfo.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="John"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors duration-200 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:border-tertiary`}
              />
              {errors.firstName && (
                <p className="mt-1 text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-text-dark font-medium mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactInfo.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Doe"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors duration-200 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:border-tertiary`}
              />
              {errors.lastName && (
                <p className="mt-1 text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-dark font-medium mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={handlePhoneChange}
                placeholder="(123) 456-7890"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors duration-200 ${
                  errors.phone ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:border-tertiary`}
              />
              {errors.phone && (
                <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-text-dark font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors duration-200 ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:border-tertiary`}
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          {/* SMS Opt-in */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="receiveTexts"
              checked={contactInfo.receiveTexts}
              onChange={(e) => handleInputChange('receiveTexts', e.target.checked)}
              className="w-4 h-4 text-tertiary border-gray-300 rounded focus:ring-tertiary"
            />
            <label htmlFor="receiveTexts" className="text-text-dark">
              Receive text messages
            </label>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Step4Contact;