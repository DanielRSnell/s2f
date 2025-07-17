# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn check` - Run Astro type checking
- `yarn format` - Format code with Prettier

## Architecture Overview

This is an Astro-based static site generator project being converted from a security SaaS template ("Fortify") to Street2Fleet's scheduling software website. Street2Fleet provides online scheduling software for home service businesses, integrating websites with CRM systems for real-time appointment booking. The architecture follows a modern content-driven approach:

### Core Structure
- **Astro Framework**: Uses Astro 5.4.1 as the primary framework with React integration
- **Content Collections**: Structured content management through Astro's content collections API
- **Hybrid Rendering**: Static generation with React components for interactivity

### Content Management
- All content is stored in `src/content/` using Markdown and MDX files
- Content is organized into collections defined in `src/content.config.ts`:
  - Pages: `about`, `authors`, `blog`, `changelog`, `contact`, `features`, `integration`, `pages`, `pricing`, `review`
  - Sections: Reusable content sections like `homeBannerSection`, `featuresSection`, etc.
- Configuration files in `src/config/` control site settings, menus, and theme

### Component Architecture
- **Layouts**: Base layouts in `src/layouts/` with `Base.astro` as the main layout
- **Components**: Reusable UI components in `src/layouts/components/`
- **Partials**: Page sections in `src/layouts/partials/`
- **Shortcodes**: Interactive React components in `src/layouts/shortcodes/` (auto-imported in MDX)

### Styling & Assets
- **Tailwind CSS**: Primary styling framework with custom plugins in `src/tailwind-plugin/`
- **Custom CSS**: Additional styles in `src/styles/`
- **Fonts**: Custom fonts (ClashGrotesk, Satoshi) in `public/fonts/`
- **Images**: All images organized in `public/images/` by category

### Key Features
- **Auto-import**: Shortcode components are automatically imported in MDX files
- **Markdown Processing**: Enhanced with remark plugins for TOC, collapsible sections, and modified time
- **Syntax Highlighting**: Shiki with "one-dark-pro" theme
- **Sitemap & RSS**: Automatic generation for SEO
- **Sharp Image Processing**: Optimized image handling

### Development Notes
- Uses Yarn as package manager
- TypeScript configuration for type safety
- Prettier for code formatting with Astro and Tailwind plugins
- ESLint for code linting
- No README.md file exists in the project

## Street2Fleet Project Context

### Business Information
- **Company**: Street2Fleet (https://street2fleet.com/)
- **Location**: Pompton Plains, NJ
- **Contact**: (877)343-2654
- **Service**: Online scheduling software for home service businesses

### Target Audience
- Home service businesses (garage door services, home repairs, etc.)
- Businesses seeking to increase booking rates and reduce administrative overhead
- Companies wanting 24/7 scheduling convenience for customers

### Key Features to Highlight
- Real-time availability display
- Automated text message confirmations
- CRM integration (currently ServiceTitan, expanding to others)
- One-click booking for returning customers
- Eliminates manual call-backs and reduces unanswered calls

### Content Transformation Strategy
The current security-focused "Fortify" content is being transformed to Street2Fleet's scheduling software messaging:

**Brand Transformation**:
- "Fortify" → "Street2Fleet"
- "Data Protection" → "Appointment Scheduling"
- "Security Solutions" → "Booking Solutions"

**Core Value Propositions**:
- Increase booking rates
- Reduce administrative communication overhead
- Provide 24/7 scheduling convenience
- Eliminate hold times and capture leads immediately
- Streamline booking process with CRM integration

**Content Sections to Update**:
- Homepage hero: Focus on streamlining home service business scheduling
- Features: Real-time scheduling, CRM integration, automated notifications
- How it works: Customer journey from website visit to booking confirmation
- Testimonials: Home service business success stories
- FAQ: Scheduling software specific questions
- About: Company mission and team in Pompton Plains, NJ
- Integration: CRM systems (ServiceTitan focus)
- Blog: Topics around scheduling optimization and business growth

### Design Preservation
- Maintain existing Astro component structure and styling
- Keep Tailwind CSS framework and custom plugins
- Preserve image organization and asset management
- Maintain modular content section approach
- Update only content/copy, not design or functionality