# Hyderabad Fine Gold 999

## Overview

A premium gold and silver jewelry e-commerce website for "Hyderabad Fine Gold 999" - a Hyderabad-based precious metals business. The application features a luxurious dark theme with gold accents, Telugu language support, product catalog display, and a booking/inquiry system. Built as a full-stack TypeScript application with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom gold/dark theme, CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for smooth transitions
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for type-safe validation
- **Build Tool**: esbuild for server bundling, Vite for client

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (requires DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` - defines `products` and `bookings` tables
- **Migrations**: Drizzle Kit with `db:push` command

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Database table definitions and Zod insert schemas
- `routes.ts`: API route definitions with input/output type schemas

### Development vs Production
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: Static files served from `dist/public`, server bundled to `dist/index.cjs`

### Key Design Decisions
1. **Monorepo Structure**: Client (`client/`), server (`server/`), and shared code (`shared/`) in single repo
2. **Type Safety**: End-to-end TypeScript with Zod schemas shared between frontend and backend
3. **Theming**: Dark theme with gold (#D4AF37) as primary accent, designed for luxury jewelry brand
4. **Bilingual Support**: English and Telugu language content for Hyderabad market

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage (available but not currently used)

### UI/Frontend Libraries
- **@radix-ui/***: Headless UI primitives for accessible components
- **framer-motion**: Animation library
- **lucide-react**: Icon library
- **embla-carousel-react**: Carousel component

### Build & Development
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server bundling
- **Drizzle Kit**: Database migrations

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator