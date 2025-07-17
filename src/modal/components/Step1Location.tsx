import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaTruck } from 'react-icons/fa';
import { validateZipCode } from '@/modal/utils/mockData';

interface Step1LocationProps {
  zipCode: string;
  onZipCodeChange: (zipCode: string) => void;
  onNext: () => void;
  onCancel: () => void;
  validationError?: string;
  isValidating?: boolean;
}

const Step1Location: React.FC<Step1LocationProps> = ({
  zipCode,
  onZipCodeChange,
  onNext,
  onCancel,
  validationError = '',
  isValidating = false
}) => {
  const [inputValue, setInputValue] = useState(zipCode);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setInputValue(value);
    onZipCodeChange(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Enter key will be handled by the parent component
      return;
    }
  };

  return (
    <div className="p-4">
      {/* Truck Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-tertiary to-secondary rounded-full flex items-center justify-center shadow-lg">
            <div className="relative">
              <FaTruck 
                className="text-gray-700 drop-shadow-sm" 
                size={20} 
              />
              <FaMapMarkerAlt 
                className="absolute -top-1 -right-1 text-tertiary drop-shadow-sm" 
                size={12} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text-dark mb-3">
          Where are you?
        </h3>
        <p className="text-text text-sm leading-relaxed">
          Enter your zip or postal code so we can check if we provide service in your area.
        </p>
      </div>

      {/* Zip Code Input */}
      <div className="mb-6">
        <label htmlFor="zipCode" className="block text-text-dark font-medium mb-2">
          Zip Code <span className="text-red-500">*</span>
        </label>
        <input
          id="zipCode"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="12345"
          className={`w-full px-3 py-2 border-2 rounded-lg text-base transition-colors duration-200 ${
            validationError 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-tertiary focus:border-tertiary'
          } focus:outline-none focus:ring-0`}
          maxLength={5}
        />
        {validationError && (
          <p className="mt-2 text-red-500 text-sm">{validationError}</p>
        )}
      </div>

    </div>
  );
};

export default Step1Location;