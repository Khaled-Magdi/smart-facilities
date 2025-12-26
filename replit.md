# Smart Facilities Operations Management System

## Overview

A self-hosted web application for managing smart facilities operations with multi-phase workflow tracking. The system handles facility lifecycle management from creation through visits, procurement, installation, and maintenance phases. Built as a bilingual (Arabic/English) enterprise application with RTL/LTR support, light/dark themes, and responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state caching and synchronization
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Design System**: Carbon Design System (IBM) influences with comprehensive color tokens

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **API Pattern**: RESTful JSON API endpoints under `/api/*`
- **Build System**: Vite for frontend, esbuild for server bundling

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Storage Abstraction**: In-memory storage implementation with interface for database migration

### Key Design Patterns
- **Monorepo Structure**: Client (`client/`), server (`server/`), and shared code (`shared/`)
- **Path Aliases**: `@/` for client source, `@shared/` for shared modules
- **Internationalization**: Context-based i18n with Arabic (RTL) and English (LTR) support
- **Theme System**: CSS custom properties with dark mode toggle via class-based switching

### Database Schema
Core entities include:
- Users (authentication and RBAC)
- Facility Types, Device Types, Execution Phases (master data)
- Facilities (main entity with status and phase tracking)
- Facility Visits, Devices, Installations, Maintenance records
- Inventory Items with device type linkage
- Visit Questions, Installation Steps, Maintenance Types (configurable workflows)

## External Dependencies

### Database
- PostgreSQL (configured via `DATABASE_URL` environment variable)
- Drizzle Kit for migrations (`npm run db:push`)

### UI Libraries
- Radix UI primitives for accessible components
- Recharts for data visualization
- Embla Carousel for carousel functionality
- Vaul for drawer components

### Development Tools
- Vite dev server with HMR
- Replit-specific plugins for development (cartographer, dev-banner, error overlay)

### Fonts
- IBM Plex Sans and IBM Plex Sans Arabic (Google Fonts CDN)