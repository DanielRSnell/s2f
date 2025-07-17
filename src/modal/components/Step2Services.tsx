import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEdit, FaWrench, FaThermometerHalf, FaBolt, FaDoorOpen, FaCog } from 'react-icons/fa';
import type { ServiceCategory, ServiceType, ServiceSpecific } from '@/modal/types/booking';
import { mockServiceCategories, mockServiceTypes, mockSpecificServices, mockEquipmentAges } from '@/modal/utils/mockData';

interface Step2ServicesProps {
  location: string;
  selectedCategory: ServiceCategory | null;
  selectedType: ServiceType | null;
  selectedSpecific: ServiceSpecific | null;
  equipmentAge: string;
  onCategorySelect: (category: ServiceCategory) => void;
  onTypeSelect: (type: ServiceType) => void;
  onSpecificSelect: (specific: ServiceSpecific) => void;
  onEquipmentAgeSelect: (age: string) => void;
  onNext: () => void;
  onEmergency: () => void;
  onEditLocation: () => void;
}

const iconMap = {
  'FaWrench': FaWrench,
  'FaThermometerHalf': FaThermometerHalf,
  'FaBolt': FaBolt,
  'FaDoorOpen': FaDoorOpen,
  'FaCog': FaCog
};

const Step2Services: React.FC<Step2ServicesProps> = ({
  location,
  selectedCategory,
  selectedType,
  selectedSpecific,
  equipmentAge,
  onCategorySelect,
  onTypeSelect,
  onSpecificSelect,
  onEquipmentAgeSelect,
  onNext,
  onEmergency,
  onEditLocation
}) => {
  const [currentStep, setCurrentStep] = useState<'category' | 'type' | 'specific' | 'age'>('category');

  const getFilteredServices = () => {
    if (!selectedCategory) return [];
    return mockSpecificServices.filter(service => 
      service.serviceType === selectedType?.id
    );
  };

  const handleCategorySelect = (category: ServiceCategory) => {
    onCategorySelect(category);
    setCurrentStep('type');
  };

  const handleTypeSelect = (type: ServiceType) => {
    onTypeSelect(type);
    if (type.id === 'estimate') {
      onNext();
    } else {
      setCurrentStep('specific');
    }
  };

  const handleSpecificSelect = (specific: ServiceSpecific) => {
    onSpecificSelect(specific);
    if (selectedCategory?.id === 'hvac') {
      setCurrentStep('age');
    } else {
      onNext();
    }
  };

  const handleAgeSelect = (age: string) => {
    onEquipmentAgeSelect(age);
    onNext();
  };

  const canContinue = selectedCategory && selectedType && (
    selectedType.id === 'estimate' || 
    selectedSpecific && (selectedCategory.id !== 'hvac' || equipmentAge)
  );

  return (
    <div className="p-6">
      {/* Location Bar */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-6">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-tertiary" />
          <span className="font-medium text-text-dark">{location}</span>
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
        <button
          onClick={onEditLocation}
          className="text-tertiary hover:text-secondary transition-colors"
        >
          <FaEdit size={16} />
        </button>
      </div>

      {/* Service Category Selection */}
      {currentStep === 'category' && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-text-dark mb-6">
            What do you need help with?
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {mockServiceCategories.map((category, index) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap];
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleCategorySelect(category)}
                  className={`p-4 border-2 rounded-lg transition-all hover:border-tertiary hover:bg-gray-50 ${
                    selectedCategory?.id === category.id
                      ? 'border-tertiary bg-secondary/10'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 mb-3 flex items-center justify-center">
                      <IconComponent size={24} className="text-tertiary" />
                    </div>
                    <span className="font-medium text-text-dark">{category.name}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Service Type Selection */}
      {currentStep === 'type' && selectedCategory && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-text-dark mb-6">
            What type of service do you need?
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {mockServiceTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type)}
                className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:border-tertiary hover:bg-gray-50 ${
                  selectedType?.id === type.id
                    ? 'border-tertiary bg-secondary/10'
                    : 'border-gray-200'
                }`}
              >
                <div className="font-medium text-text-dark">{type.name}</div>
                <div className="text-sm text-text mt-1">{type.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Specific Service Selection */}
      {currentStep === 'specific' && selectedType && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-text-dark mb-6">
            What needs a {selectedType.name.toLowerCase()}?
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {getFilteredServices().map((service) => (
              <button
                key={service.id}
                onClick={() => handleSpecificSelect(service)}
                className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:border-tertiary hover:bg-gray-50 ${
                  selectedSpecific?.id === service.id
                    ? 'border-tertiary bg-secondary/10'
                    : 'border-gray-200'
                }`}
              >
                <div className="font-medium text-text-dark">{service.name}</div>
                <div className="text-sm text-text mt-1">{service.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Equipment Age Selection */}
      {currentStep === 'age' && selectedCategory?.id === 'hvac' && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-text-dark mb-6">
            How old is your {selectedCategory.name.toLowerCase()} system?
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {mockEquipmentAges.map((age) => (
              <button
                key={age.id}
                onClick={() => handleAgeSelect(age.id)}
                className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:border-tertiary hover:bg-gray-50 ${
                  equipmentAge === age.id
                    ? 'border-tertiary bg-secondary/10'
                    : 'border-gray-200'
                }`}
              >
                <div className="font-medium text-text-dark">{age.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Step2Services;