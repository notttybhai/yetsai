# Overview

YetSAI is a modern AI chat application built with a full-stack architecture featuring React frontend and Express.js backend. The application provides real-time conversational AI capabilities powered by OpenAI's GPT models, with a sophisticated user interface built using shadcn/ui components and Tailwind CSS for styling.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React 18 using TypeScript and modern tooling:
- **Component Library**: shadcn/ui components built on top of Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom CSS variables for theming, featuring a dark-themed gradient design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration for development and production builds
- **Form Handling**: React Hook Form with Zod validation through @hookform/resolvers

## Backend Architecture
The server-side uses Express.js with TypeScript in ESM module format:
- **API Structure**: RESTful endpoints with centralized route registration
- **Request Handling**: Express middleware for JSON parsing, request logging, and error handling
- **Session Management**: In-memory storage implementation with interface-based design for easy database integration
- **Development Setup**: Custom Vite integration for hot module replacement in development

## Database Design
The application uses Drizzle ORM with PostgreSQL schema definition:
- **Conversations Table**: Stores chat sessions with unique session IDs and timestamps
- **Messages Table**: Stores individual messages linked to conversations with role-based categorization (user/assistant)
- **Schema Validation**: Zod schemas for runtime validation of database operations and API requests
- **Migration Support**: Drizzle Kit configuration for database migrations

## AI Integration
OpenAI API integration for conversational AI:
- **Model**: Configured to use GPT-5 (latest available model)
- **Context Management**: Maintains conversation history for contextual responses
- **Error Handling**: Robust error handling with fallback responses
- **Temperature Control**: Balanced creativity setting (0.7) for natural conversations

## Development Environment
Replit-optimized setup with specialized tooling:
- **Error Handling**: Custom runtime error modal plugin for development debugging
- **Asset Management**: Configured asset resolution and build optimization
- **TypeScript**: Strict type checking with comprehensive path mapping
- **Hot Reload**: Development server with file watching and automatic restarts

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity optimized for serverless environments
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect support
- **drizzle-kit**: Database migration and schema management tools

## UI Component Libraries
- **@radix-ui/***: Comprehensive set of accessible, unstyled UI primitives including dialogs, dropdowns, forms, and navigation components
- **@tanstack/react-query**: Powerful data synchronization for React applications
- **tailwindcss**: Utility-first CSS framework with custom configuration

## Form and Validation
- **react-hook-form**: Performant forms with minimal re-renders
- **@hookform/resolvers**: Integration between React Hook Form and validation libraries
- **zod**: TypeScript-first schema validation

## Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development enhancements
- **tsx**: TypeScript execution environment for Node.js

## Styling and Icons
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Conditional className utility
- **tailwind-merge**: Utility for merging Tailwind CSS classes
- **lucide-react**: Modern icon library with React components

## OpenAI Integration
- **openai**: Official OpenAI API client for Node.js with streaming support and comprehensive error handling