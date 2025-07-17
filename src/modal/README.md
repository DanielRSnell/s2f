# Street2Fleet Lead Capture Modal

A complete React-based lead capture modal system for home service businesses with a multi-step booking flow.

## Overview

This modal provides a complete booking experience that mirrors typical home service scheduling flows. It's designed as a demo/prototype with mock data but maintains the exact look and feel of the reference design adapted for Street2Fleet's brand colors and styling.

## Design Analysis

Based on the example UI images (`example-ui/`), the modal follows a 4-step flow:

### Step 1: Location Input
- **Purpose**: Capture service area/zip code
- **Elements**: 
  - Header with brand name and "Book Online Now"
  - Hero section with house icon and truck icon
  - "Where are you?" question
  - Zip code input field
  - Cancel/Confirm buttons
- **Visual**: Clean white background with red/orange header, centered truck icon with location pin

### Step 2: Service Selection
- **Purpose**: Multi-level service selection
- **Elements**:
  - Location confirmation bar (with edit option)
  - Service category selection (Plumbing, Heating & Cooling, Sewer/Excavation, Electrical)
  - Service type selection (Repair, Tune-Up, New System)
  - Specific service selection (A/C Tune-Up, Furnace Tune-Up)
  - Equipment age selection
  - Emergency option
  - Continue Booking button
- **Visual**: Icon-based service selection with red accent borders

### Step 3: Scheduling
- **Purpose**: Appointment time selection
- **Elements**:
  - Service summary section
  - "When do you need us?" question
  - First Available vs All Appointments toggle
  - Time zone display
  - Available time slots
  - Emergency option
  - Continue Booking button
- **Visual**: Clean layout with time slot selection

### Step 4: Contact Information
- **Purpose**: Lead capture form
- **Elements**:
  - Complete booking summary
  - Contact form (First Name, Last Name, Phone, Email)
  - SMS opt-in checkbox
  - Continue button
- **Visual**: Final form with all previous selections summarized

## Technical Implementation

### Color Scheme Adaptation
- **Primary Red**: Replace with Street2Fleet's `#7eafc2` (tertiary color)
- **Secondary Red**: Replace with Street2Fleet's `#b8d4e0` (secondary color)
- **Accent Colors**: Use existing theme colors from `src/config/theme.json`

### Asset Integration
- **House Icon**: Use `FaHome` from react-icons/fa
- **Truck Icon**: Use `FaTruck` from react-icons/fa
- **Service Icons**: Use react-icons library (already installed)

### Service Categories (Mock Data)
- **Plumbing**: Faucet icon (react-icons)
- **Heating & Cooling**: Thermometer icon (react-icons)
- **Electrical**: Lightning bolt icon (react-icons)
- **Garage Doors**: Door icon (react-icons)
- **Appliance Repair**: Wrench icon (react-icons)

### Component Structure
```
src/modal/
├── README.md
├── LeadCaptureModal.tsx     # Main modal component
├── components/
│   ├── Step1Location.tsx    # Location/zip code input
│   ├── Step2Services.tsx    # Service selection
│   ├── Step3Scheduling.tsx  # Time slot selection
│   ├── Step4Contact.tsx     # Contact form
│   └── ModalHeader.tsx      # Shared header component
├── hooks/
│   └── useKeyboardShortcut.tsx  # CMD+L handler
├── types/
│   └── booking.ts           # TypeScript interfaces
└── utils/
    └── mockData.ts          # Mock data for demo
```

## Features

### Keyboard Shortcut
- **Trigger**: CMD+L (⌘+L) opens the modal
- **Purpose**: Easy testing and demonstration
- **Implementation**: Global keyboard event listener

### Mock Data
- Pre-populated service options
- Fake available time slots
- Mock location validation
- Simulated booking flow

### Responsive Design
- Mobile-first approach
- Tailwind CSS classes
- Consistent with site's existing responsive patterns

## Development Notes

- Uses existing Tailwind configuration and color scheme
- Integrates with site's existing React setup
- Follows existing component patterns
- Maintains consistency with site's typography and spacing
- All data is mock/demo - no real API integrations

## Usage

The modal is activated via CMD+L keyboard shortcut for testing purposes. Once integrated, it can be triggered by buttons, links, or other user interactions throughout the site.