import type { ServiceCategory, ServiceType, ServiceSpecific, TimeSlot } from '@/modal/types/booking';

export const mockServiceCategories: ServiceCategory[] = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: 'FaWrench',
    description: 'Faucets, pipes, drains, and water systems'
  },
  {
    id: 'hvac',
    name: 'Heating & Cooling',
    icon: 'FaThermometerHalf',
    description: 'HVAC systems, furnaces, and air conditioning'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: 'FaBolt',
    description: 'Wiring, outlets, lighting, and electrical systems'
  },
  {
    id: 'garage',
    name: 'Garage Doors',
    icon: 'FaDoorOpen',
    description: 'Garage door installation, repair, and maintenance'
  },
  {
    id: 'appliance',
    name: 'Appliance Repair',
    icon: 'FaCog',
    description: 'Kitchen and laundry appliance repair'
  }
];

export const mockServiceTypes: ServiceType[] = [
  {
    id: 'repair',
    name: 'Repair',
    description: 'Fix existing issues',
    category: 'all'
  },
  {
    id: 'tune-up',
    name: 'Tune-Up',
    description: 'Preventive maintenance',
    category: 'all'
  },
  {
    id: 'installation',
    name: 'New Installation',
    description: 'Install new equipment',
    category: 'all'
  },
  {
    id: 'estimate',
    name: 'Free Estimate',
    description: 'Get a quote for new system',
    category: 'all'
  }
];

export const mockSpecificServices: ServiceSpecific[] = [
  // HVAC Services
  {
    id: 'hvac-tune-up',
    name: 'HVAC System Tune-Up',
    description: 'Complete system inspection and maintenance',
    serviceType: 'tune-up',
    estimatedDuration: 120
  },
  {
    id: 'ac-tune-up',
    name: 'A/C Tune-Up',
    description: 'Air conditioning system maintenance',
    serviceType: 'tune-up',
    estimatedDuration: 90
  },
  {
    id: 'furnace-tune-up',
    name: 'Furnace Tune-Up',
    description: 'Heating system maintenance',
    serviceType: 'tune-up',
    estimatedDuration: 90
  },
  // Plumbing Services
  {
    id: 'drain-cleaning',
    name: 'Drain Cleaning',
    description: 'Clear blocked drains and pipes',
    serviceType: 'repair',
    estimatedDuration: 60
  },
  {
    id: 'faucet-repair',
    name: 'Faucet Repair',
    description: 'Fix leaky or broken faucets',
    serviceType: 'repair',
    estimatedDuration: 45
  },
  // Electrical Services
  {
    id: 'outlet-installation',
    name: 'Outlet Installation',
    description: 'Install new electrical outlets',
    serviceType: 'installation',
    estimatedDuration: 60
  },
  {
    id: 'electrical-inspection',
    name: 'Electrical Inspection',
    description: 'Safety inspection of electrical systems',
    serviceType: 'tune-up',
    estimatedDuration: 90
  }
];

export const mockTimeSlots: TimeSlot[] = [
  {
    id: 'slot-1',
    date: '2024-07-18',
    startTime: '09:00',
    endTime: '11:00',
    available: true
  },
  {
    id: 'slot-2',
    date: '2024-07-18',
    startTime: '13:00',
    endTime: '15:00',
    available: true
  },
  {
    id: 'slot-3',
    date: '2024-07-18',
    startTime: '15:00',
    endTime: '17:00',
    available: false
  },
  {
    id: 'slot-4',
    date: '2024-07-19',
    startTime: '08:00',
    endTime: '10:00',
    available: true
  },
  {
    id: 'slot-5',
    date: '2024-07-19',
    startTime: '10:00',
    endTime: '12:00',
    available: true
  },
  {
    id: 'slot-6',
    date: '2024-07-19',
    startTime: '14:00',
    endTime: '16:00',
    available: true
  }
];

export const mockEquipmentAges = [
  { id: 'new', label: 'Less than 5 Years Old' },
  { id: 'medium', label: '5-10 Years Old' },
  { id: 'old', label: '10+ Years Old' },
  { id: 'unknown', label: 'Not Sure' }
];

export const mockLocations = [
  { zipCode: '84044', city: 'Magna', state: 'UT', serviceArea: true },
  { zipCode: '84101', city: 'Salt Lake City', state: 'UT', serviceArea: true },
  { zipCode: '84102', city: 'Salt Lake City', state: 'UT', serviceArea: true },
  { zipCode: '90210', city: 'Beverly Hills', state: 'CA', serviceArea: false },
  { zipCode: '10001', city: 'New York', state: 'NY', serviceArea: false }
];

export const validateZipCode = (zipCode: string) => {
  const location = mockLocations.find(loc => loc.zipCode === zipCode);
  return location ? {
    valid: true,
    location: location.serviceArea ? `${location.city}, ${location.state}` : null,
    inServiceArea: location.serviceArea,
    message: location.serviceArea 
      ? `Great! We service ${location.city}, ${location.state}` 
      : `Sorry, we don't currently service ${location.city}, ${location.state}`
  } : {
    valid: false,
    location: null,
    inServiceArea: false,
    message: 'Please enter a valid zip code'
  };
};