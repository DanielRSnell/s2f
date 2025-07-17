import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaClock, FaCalendarAlt } from 'react-icons/fa';
import type { ServiceCategory, ServiceSpecific, TimeSlot } from '@/modal/types/booking';
import { mockTimeSlots } from '@/modal/utils/mockData';

interface Step3SchedulingProps {
  location: string;
  selectedCategory: ServiceCategory | null;
  selectedSpecific: ServiceSpecific | null;
  equipmentAge: string;
  selectedTimeSlot: TimeSlot | null;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  onNext: () => void;
  onEmergency: () => void;
  onEditSummary: () => void;
}

const Step3Scheduling: React.FC<Step3SchedulingProps> = ({
  location,
  selectedCategory,
  selectedSpecific,
  equipmentAge,
  selectedTimeSlot,
  onTimeSlotSelect,
  onNext,
  onEmergency,
  onEditSummary
}) => {
  const [viewMode, setViewMode] = useState<'first' | 'all'>('first');
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const getAvailableSlots = () => {
    const available = mockTimeSlots.filter(slot => slot.available);
    if (viewMode === 'first') {
      return available.slice(0, 1);
    }
    return available;
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
    <div className="p-6">
      {/* Summary Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-text-dark">SUMMARY</h3>
          <button
            onClick={onEditSummary}
            className="text-tertiary hover:text-secondary transition-colors"
          >
            <FaEdit size={16} />
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-tertiary" size={20} />
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
      </div>

      {/* When do you need us? */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-text-dark mb-4">
          When do you need us?
        </h3>
        
        {/* First Available / All Appointments Toggle */}
        <div className="flex border-2 border-tertiary rounded-lg overflow-hidden mb-4">
          <button
            onClick={() => setViewMode('first')}
            className={`flex-1 px-4 py-3 transition-colors ${
              viewMode === 'first'
                ? 'bg-tertiary text-white'
                : 'bg-white text-tertiary hover:bg-secondary/10'
            }`}
          >
            First Available
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`flex-1 px-4 py-3 transition-colors ${
              viewMode === 'all'
                ? 'bg-tertiary text-white'
                : 'bg-white text-tertiary hover:bg-secondary/10'
            }`}
          >
            All Appointments
          </button>
        </div>

        {/* Time Zone */}
        <div className="mb-4">
          <p className="text-sm text-text uppercase tracking-wide mb-2">TIME ZONE</p>
          <div className="flex items-center gap-2">
            <FaClock className="text-tertiary" size={16} />
            <span className="text-text-dark">
              Eastern Daylight Time ({new Date().toLocaleTimeString('en-US', { 
                timeZoneName: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })})
            </span>
          </div>
        </div>

        {/* Available Slots */}
        <div className="mb-6">
          <p className="text-sm text-text uppercase tracking-wide mb-3">
            {viewMode === 'first' ? 'FIRST AVAILABLE' : 'AVAILABLE APPOINTMENTS'}
          </p>
          
          <div className="space-y-3">
            {getAvailableSlots().map((slot, index) => (
              <motion.button
                key={slot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onTimeSlotSelect(slot)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:border-tertiary hover:bg-gray-50 ${
                  selectedTimeSlot?.id === slot.id
                    ? 'border-tertiary bg-secondary/10'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-text-dark">
                      {formatDate(slot.date)}
                    </div>
                    <div className="text-tertiary">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </div>
                  </div>
                  {selectedTimeSlot?.id === slot.id && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      className="w-6 h-6 bg-tertiary rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-xs">✓</span>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Step3Scheduling;