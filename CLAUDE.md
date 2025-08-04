# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on localhost:5173
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without fixing
- `npm run preview` - Preview production build locally

## Testing Commands

### Unit/Integration Tests (Vitest)

- `npm test` - Run tests in watch mode with Vitest
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with interactive UI interface
- `npm run test:coverage` - Run tests with coverage report

### End-to-End Tests (Playwright)

- `npm run test:e2e` - Run Playwright tests in headless mode
- `npm run test:e2e:ui` - Run Playwright tests with interactive UI
- `npm run test:e2e:debug` - Run Playwright tests in debug mode with inspector
- `npm run test:e2e:headed` - Run Playwright tests in headed mode (visible browser)
- `npm run test:e2e:report` - Show detailed HTML test report

## Architecture Overview

This is a React + TypeScript + Vite starter template using shadcn/ui components built on Radix UI primitives.

### Core Architecture

**App Entry Point**: `App.tsx` sets up the theme provider and router wrapper using `BrowserRouter` for standard routing.

**Routing**: `Router.tsx` defines routes using React Router v7. All routes are wrapped in `AppLayout` component which provides header, footer, and main content area.

**Layout System**: `AppLayout` component provides the main application shell with responsive design and proper content spacing.

**Theme Management**: `ThemeContext.tsx` provides theme switching (light/dark/system) with localStorage persistence. Theme is applied by adding CSS classes to document root.

### Configuration System

**App Configuration**: `src/config/app.ts` - Contains app metadata (name, GitHub info, author) using environment variables with fallbacks.

**Menu Configuration**: `src/config/menu.ts` - Defines navigation menu items with icons (from Lucide React), titles, and URLs. Menu supports nested items and external links.

### Component Architecture

**UI Components**: Located in `src/components/ui/` - shadcn/ui components built on Radix UI primitives with Tailwind CSS styling and class-variance-authority for variant management.

**Layout Components**: `app-header.tsx`, `app-footer.tsx`, `app-sidebar.tsx` provide application shell components.

**Page Components**: Located in `src/pages/` - Feature pages that are routed to. Currently includes Dashboard and Sample pages.

### Styling System

Uses Tailwind CSS v4 with custom configuration. The project includes:

- `tailwind-merge` for merging Tailwind classes
- `tailwindcss-animate` for animations
- `clsx` for conditional class application
- CSS custom properties for theme variables

### Build and Deployment

**Development**: Uses Vite with React plugin and Tailwind CSS plugin for fast development.

**Production**: TypeScript compilation followed by Vite build.

### Key Dependencies

- React 19 with TypeScript
- React Router DOM v7 for routing
- Radix UI primitives for accessible components
- Lucide React for icons
- Tailwind CSS v4 for styling
- Vite for build tooling
- Vitest for testing framework
- React Testing Library for component testing

### Environment Variables

- `VITE_APP_NAME` - Application name (fallback: "Sample App")

### Testing Architecture

**Test Framework**: Uses Vitest for fast, Vite-powered testing with jsdom environment for React component testing.

**Test Organization**:

- Unit Test files located in `__tests__/` directories next to source files
- `src/test/setup.ts` - Global unit test configuration with jest-dom matchers
- `src/test/test-utils.tsx` - Custom render function with providers (Router, Theme)

**Testing Patterns**:

- Component unit tests focus on user interactions and rendering
- Uses React Testing Library for DOM queries and user event simulation
- Mock browser APIs (localStorage, matchMedia) for theme system testing

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `Router.tsx`
3. Add menu item in `src/config/menu.ts` if needed for navigation
4. Create test file in `src/pages/__tests__/` for component testing

### Adding / Editiing Component Unit Tests

When needing to edit or add new unit tests refer to @.claude/commands/create_unit_tests.md

### Adding / Editing Playwright E2E Test

When needing to edit or add new Playwright E2E Tests refer to @.claude/commands/create_e2e_tests.md

## Code Formatting

This project uses Prettier for code formatting integrated with ESLint. Prettier is configured to:

- Use single quotes
- Include semicolons
- Use 2-space indentation
- Set print width to 80 characters
- Add trailing commas for ES5 compatibility

You can customize these settings in `.prettierrc.json`.

## The Development workflow should be:

1. Make code changes according to the plan
2. Run npm run format to format code with Prettier
3. Run npm run lint to check code style (includes Prettier formatting check)
4. Run npm run typecheck to verify TypeScript correctness
5. Run npm run test:run and follow the following appropriate rule:
   a. If in TDD mode (test-driven development mode) :
   All test should pass except for the tests that were modified or added for the upcoming change.
   b. If not in TDD mode then all test should pass.
6. For E2E testing, run npm run test:e2e to ensure application works end-to-end
7. Iterate on these steps as necessary.
