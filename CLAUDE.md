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

**App Entry Point**: `App.tsx` sets up the router wrapper using `BrowserRouter` for standard routing.

**Routing**: `Router.tsx` defines routes using React Router v7. All routes are wrapped in `AppLayout` component which provides header, footer, and main content area.

**Layout System**: `AppLayout` component provides the main application shell with responsive design and proper content spacing.

**Menu Configuration**: `src/config/menu.ts` - Defines navigation menu items with icons (from Lucide React), titles, and URLs. Menu supports nested items and external links.

### Component Architecture

**UI Components**: Located in `src/components/ui/` - shadcn/ui components built on Radix UI primitives with Tailwind CSS styling and class-variance-authority for variant management.

**Layout Components**: `app-header.tsx`, `app-footer.tsx`, `app-sidebar.tsx` provide application shell components.

**Page Components**: Located in `src/pages/` - Feature pages that are routed to. Currently includes Dashboard and Sample pages.

**Tables and Forms**: When adding new tables always use TanStack Table. When adding new forms always use TanStack Form.

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

**Unit Tests**:

- Vitest + React Testing Library for coponent testing
- Unit Test files use `.test.ts` or `.test.tsx` suffix and are located in `__tests__/` directories next to source files
- `src/test/setup.ts` - Global unit test configuration with jest-dom matchers
- `src/test/test-utils.tsx` - Custom render function with providers (Router)

**E2E Tests**:

- Playwright for E2E testing
- E2E test files use `.spec.ts` suffix and are located in the `tests/` directory

**Adding / Editiing Component Unit Tests**:

When needing to edit or add new unit tests refer to @.claude/commands/create_unit_tests.md
If you cannot find this command please abort and let me know.

**Adding / Editing Playwright E2E Test**:

When needing to edit or add new Playwright E2E Tests refer to @.claude/commands/create_e2e_tests.md
If you cannot find this command please abort and let me know.

Whenever adding new tests that require data from the backend to be mocked, use Mock Service Worker (mswjs.io).

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `Router.tsx`
3. Add menu item in `src/config/menu.ts` if needed for navigation
4. Create test file in `src/pages/__tests__/` for component testing
5. If the components in the page require data to be fetched from the backend, use Mock Service Worker (mswjs.io) to return sample data.

## Code Style and Structure Guidelines

### TypeScript and React Best Practices

- Write concise, technical TypeScript code with accurate examples
- Use functional and declarative programming patterns; avoid classes
- Favor iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`)
- Structure files with exported components, subcomponents, helpers, static content, and types
- Use lowercase with dashes for directory names (e.g., `components/auth-wizard`)

### Error Handling and Validation

- Prioritize error handling and edge cases:
  - Use early returns for error conditions
  - Implement guard clauses to handle preconditions and invalid states early
  - Use custom error types for consistent error handling
- Consider implementing Zod for schema validation when handling complex data structures

### Performance and Optimization

- Implement dynamic imports for code splitting and optimization
- Use responsive design with a mobile-first approach
- Optimize images: use WebP format, include size data, implement lazy loading
- Follow performance optimization techniques to reduce load times and improve rendering efficiency

### State Management Recommendations

For applications requiring complex state management beyond React's built-in state, consider:

- **Zustand** - Lightweight state management solution
- **TanStack React Query** - Server state management and data fetching
- Implement proper data fetching patterns with caching and error handling

### Security and Best Practices

- Implement proper error handling and user input validation
- Follow secure coding practices for user data handling
- Validate all external data sources and user inputs
- Use TypeScript's strict mode for enhanced type safety

### Documentation Standards

- Provide clear and concise comments for complex logic
- Use JSDoc comments for functions and components to improve IDE intellisense
- Document component props and their expected types
- Include usage examples for complex components

## Code Formatting

This project uses Prettier for code formatting integrated with ESLint. Prettier is configured to:

- Use single quotes
- Include semicolons
- Use 2-space indentation
- Set print width to 80 characters
- Add trailing commas for ES5 compatibility

You can customize these settings in `.prettierrc.json`.

## Development Methodology

### Approach

1. **System 2 Thinking**: Approach problems with analytical rigor. Break down requirements into smaller, manageable parts and thoroughly consider each step before implementation.

2. **Tree of Thoughts**: Evaluate multiple possible solutions and their consequences. Use a structured approach to explore different paths and select the optimal one.

3. **Iterative Refinement**: Before finalizing code, consider improvements, edge cases, and optimizations. Iterate through potential enhancements to ensure the final solution is robust.

### Development Process

1. **Deep Dive Analysis**: Begin by conducting thorough analysis of the task, considering technical requirements and constraints.

2. **Planning**: Develop a clear plan that outlines architectural structure and flow of the solution.

3. **Implementation**: Implement the solution step-by-step, ensuring each part adheres to specified best practices.

4. **Review and Optimize**: Perform code review, looking for areas of potential optimization and improvement.

5. **Finalization**: Ensure code meets all requirements, is secure, and is performant.

## The Development Workflow

1. Make code changes according to the plan
2. Run `npm run format` to format code with Prettier
3. Run `npm run lint` to check code style (includes Prettier formatting check)
4. Run `npm run typecheck` to verify TypeScript correctness
5. Run `npm run test:run` and follow the appropriate rule:
   a. If in TDD mode (test-driven development): All tests should pass except for tests that were modified or added for the upcoming change.
   b. If not in TDD mode: All tests should pass.
6. Run `npm run test:e2e` and follow the appropriate rule:
   a. If in TDD mode (test-driven development): All tests should pass except for tests that were modified or added for the upcoming change.
   b. If not in TDD mode: All tests should pass.
7. Iterate on these steps as necessary.

## Business Logic

Currently the application is mostly a basic sample project.
However, over time the plan is to change it to be an app that control physical mobile devices.

The devices are kept in several Data Centers (abbreviated as DC) in different locations in the world.
The name of the app will be DCMS: Data Centers Management System.

### Capabilities of the APP:

**1. DC management:**

a. List (no need for filtering, assumed short list)

b. Fields: Location, Type (on-premise/cloud), IP range, description

c. Operations: Add, Modify, Remove

**2. Device management:**

a. List, free search filter + language (model: galaxy…)

b. Fields: ID, model, OS + version, status (connected/disconnected), DC

c. Operations: details (view/change), connect/disconnect
