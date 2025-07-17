export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface ServiceSpecific {
  id: string;
  name: string;
  description: string;
  serviceType: string;
  estimatedDuration: number;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  isEmergency?: boolean;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  receiveTexts: boolean;
}

export interface BookingData {
  zipCode: string;
  location: string;
  serviceCategory: ServiceCategory | null;
  serviceType: ServiceType | null;
  specificService: ServiceSpecific | null;
  equipmentAge: string;
  timeSlot: TimeSlot | null;
  contactInfo: ContactInfo;
  isEmergency: boolean;
}

export interface ModalStep {
  id: number;
  title: string;
  component: string;
  isComplete: boolean;
  isValid: boolean;
}

export type ModalSteps = 1 | 2 | 3 | 4 | 5 | 6;