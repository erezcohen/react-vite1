# Implementation Plan for Data Centers Page (GitHub Issue #5)

**Date:** August 7, 2025  
**Issue:** GitHub Issue #5 - Add the Data Center Page  
**Status:** Plan Approved - Ready for Implementation  

## Overview

I'll implement a modern Data Centers page as the default landing page for the DCMS application. This implementation will feature:

- **Pixel-perfect Figma design implementation** using TanStack Table with custom styling
- **Modern backend integration** using TanStack Query + MSW for API mocking  
- **Production-ready architecture** following React 19 and TypeScript best practices
- **Comprehensive testing** with both unit and e2e tests
- **Reusable components** for future scalability

## Files That Need to Be Changed

### 1. **Dependencies Installation**
- **package.json** - Add `@tanstack/react-table`, `@tanstack/react-query`, `@tanstack/eslint-plugin-query`, `msw`

### 2. **MSW Setup (New Files)**
- **public/mockServiceWorker.js** - Generated via `npx msw init ./public --save`
- **src/mocks/handlers.ts** - API mock handlers for data centers CRUD operations
- **src/mocks/browser.ts** - MSW browser setup for development  
- **src/mocks/server.ts** - MSW server setup for testing
- **src/main.tsx** - Update to conditionally enable MSW in development

### 3. **TanStack Query Setup (Modified Files)**
- **src/App.tsx** - Wrap with QueryClient provider and setup dev tools
- **vitest.setup.ts** - Update to integrate MSW with testing environment

### 4. **Data Layer (New Files)**
- **src/types/DataCenter.ts** - TypeScript interfaces for data center entities
- **src/api/datacenters.ts** - TanStack Query hooks and API functions
  - `useDataCenters()`, `useCreateDataCenter()`, `useUpdateDataCenter()`, `useDeleteDataCenter()`

### 5. **UI Components (New Files)**
- **src/components/ui/data-table.tsx** - Reusable TanStack Table component with Figma styling
- **src/components/ui/loading-skeleton.tsx** - Loading states for table rows
- **src/components/ui/empty-state.tsx** - Empty data state component  
- **src/pages/DataCenters.tsx** - Main data centers page implementation

### 6. **Routing Updates (Modified Files)**
- **src/Router.tsx** - Change default route from Dashboard to DataCenters
- **src/components/app-logo.tsx** - Add Link wrapper to navigate to `/data-centers`

### 7. **Testing Files (New Files)**
- **src/pages/__tests__/data-centers.test.tsx** - Unit tests for DataCenters page
- **src/components/ui/__tests__/data-table.test.tsx** - Unit tests for reusable DataTable
- **tests/data-centers.spec.ts** - E2E tests for navigation and table functionality

### 8. **Configuration Updates**
- **vitest.config.ts** - MSW integration setup
- **eslint.config.js** - Add TanStack Query ESLint plugin rules

## Unit Tests to Add/Edit

### **New Unit Tests**

#### 1. **data-centers.test.tsx** (New)
- Renders page correctly with loading state
- Displays data centers table when data loads
- Handles error states gracefully
- Shows Add Data Center button
- Tests TanStack Query integration with MSW

#### 2. **data-table.test.tsx** (New)
- Renders table with provided data and columns
- Handles sorting functionality
- Shows loading skeleton when loading=true
- Displays error state when error provided
- Shows empty state when no data
- Tests accessibility features (ARIA attributes)
- Tests responsive behavior

#### 3. **datacenters.api.test.tsx** (New)
- Tests useDataCenters hook with MSW
- Tests CRUD mutation hooks
- Tests error handling and retry logic
- Tests cache invalidation after mutations

### **Updated Unit Tests**

#### 4. **dashboard.test.tsx** (Edit) 
- Update to ensure Dashboard is still accessible at `/dashboard`

## E2E Tests to Add/Edit

### **New E2E Tests**

#### 1. **data-centers.spec.ts** (New)
- Navigation from logo/DCMS text goes to data centers page
- Data Centers nav link shows as active on the page
- Table displays mock data correctly
- Sorting functionality works for all columns
- Add Data Center button is present and functional
- Page loads within performance thresholds
- Responsive behavior on mobile/tablet

#### 2. **navigation.spec.ts** (New)
- Logo/DCMS click navigation works correctly
- Header navigation active states work
- Breadcrumb/navigation consistency

### **Updated E2E Tests**

#### 3. **dashboard.spec.ts** (Edit) 
- Update to test Dashboard access via direct URL

## Key Technical Specifications

### **React 19 & Modern Patterns**
- Use React 19 compatible hooks and patterns
- Implement proper concurrent features support
- Follow React 19 Suspense and error boundary patterns
- Use modern TypeScript with React 19 types

### **TanStack Query Integration**
- QueryClient with SPA-optimized defaults (no SSR complexity needed)
- Error boundaries for query failures
- Optimistic updates for mutations
- Proper cache invalidation strategies
- Loading and error state management

### **TanStack Table Configuration**
- Custom column definitions matching Figma specs exactly
- Column widths: Location (223px), Type (221px), IP Range (245px), Description (237px)
- Custom styling system using CSS variables
- Built-in sorting for all columns
- Accessibility compliance (WCAG 2.1 AA)
- Loading skeleton integration

### **MSW Implementation**
- Handlers for all CRUD operations
- Realistic response delays for development
- Proper error simulation capabilities  
- Integration with both development and testing
- Node.js compatibility for SSR/testing

### **Design System Architecture**
- Reusable DataTable component for future pages (Devices, etc.)
- CSS custom properties for consistent theming
- Tailwind integration with design tokens
- Responsive design patterns
- Custom button styling using shadcn/ui Button component

## Dependencies to Install

```json
{
  "dependencies": {
    "@tanstack/react-table": "^8.x.x",
    "@tanstack/react-query": "^5.x.x"
  },
  "devDependencies": {
    "@tanstack/eslint-plugin-query": "^5.x.x",
    "msw": "^2.x.x"
  }
}
```

## Development Workflow Integration

### 1. **Code Quality Assurance**
- Run `npm run format` (Prettier)
- Run `npm run lint` (ESLint + TanStack Query rules)
- Run `npm run typecheck` (TypeScript strict mode)

### 2. **Testing Strategy**
- Unit tests: `npm run test:run` (all should pass)
- E2E tests: `npm run test:e2e` (all should pass)  
- Coverage: `npm run test:coverage` (maintain >80% coverage)

### 3. **MSW Integration**
- Development: Automatically enabled via conditional import
- Testing: Integrated via vitest.setup.ts
- Browser validation: Real API mocking for development

## Implementation Phases

### Phase 1: Foundation Setup
1. Install dependencies (`@tanstack/react-table`, `@tanstack/react-query`, `@tanstack/eslint-plugin-query`, `msw`)
2. Initialize MSW (`npx msw init ./public --save`)
3. Set up TanStack Query provider in App.tsx with SPA-optimized configuration
4. Configure MSW for development and testing environments

### Phase 2: Data Architecture
1. Create TypeScript interfaces in `src/types/DataCenter.ts`
2. Implement API layer with TanStack Query hooks in `src/api/datacenters.ts`
3. Create MSW handlers in `src/mocks/handlers.ts`
4. Set up mock data matching Figma design specifications

### Phase 3: UI Components Development
1. Build reusable DataTable component with TanStack Table
2. Implement custom styling to match Figma design exactly
3. Create loading skeleton and empty state components
4. Develop main DataCenters page component
5. Integrate all components with TanStack Query hooks

### Phase 4: Routing and Navigation
1. Update Router.tsx to make DataCenters the default route
2. Modify app-logo.tsx to link to data centers page
3. Verify navigation active states work correctly
4. Test all navigation paths

### Phase 5: Testing Implementation
1. Create comprehensive unit tests for all components
2. Implement e2e tests for navigation and functionality
3. Test MSW integration in both development and test environments
4. Validate accessibility compliance and responsive design

### Phase 6: Quality Assurance & Deployment
1. Run all code quality checks (format, lint, typecheck)
2. Execute full test suite (unit + e2e)
3. Performance testing and optimization
4. Final design validation against Figma
5. Documentation updates

## Success Criteria

### **Functional Requirements**
- ✅ Data Centers page is default route accessible via logo click
- ✅ Navigation shows active state correctly
- ✅ TanStack Table displays data with sorting functionality
- ✅ Backend integration with TanStack Query and MSW
- ✅ Add Data Center button present and functional (UI only)

### **Design Requirements**
- ✅ Pixel-perfect match with Figma design
- ✅ Proper typography (Inter font family, weights, sizes)
- ✅ Exact color specifications (#0d0f1c, #47579e, #625b71, etc.)
- ✅ Responsive layout and spacing
- ✅ Custom button styling using project's design system

### **Technical Requirements**
- ✅ TypeScript compliance with strict mode
- ✅ Test coverage for components and API integration
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Performance optimization
- ✅ Error handling and loading states

### **Code Quality Requirements**
- ✅ Follows existing project patterns and conventions
- ✅ Passes all linting and formatting checks
- ✅ Comprehensive unit and e2e test coverage
- ✅ Proper documentation and code comments

## Future Scalability Benefits

This implementation creates a solid foundation for the DCMS application with:

1. **Reusable DataTable Component**: Can be used for future Devices page and other data-heavy pages
2. **Modern Data Fetching Architecture**: TanStack Query setup ready for real backend integration
3. **Comprehensive Testing Foundation**: Testing patterns established for future development
4. **Design System Integration**: Component architecture ready for design system expansion
5. **Performance Optimization**: Modern React 19 patterns for optimal performance

---

*This implementation plan ensures a production-ready Data Centers page that serves as the foundation for the entire DCMS application, with modern architecture, excellent developer experience, and scalable design patterns.*