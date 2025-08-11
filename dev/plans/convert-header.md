# DCMS Header Conversion Documentation

## Analysis Summary

### Current State Analysis

The existing application header (`src/components/app-header.tsx`) is a complex component featuring:

- **Left Section**: Sidebar toggle + logo (rounded rectangle) + "Sample App" text
- **Center Section**: Navigation menu with dropdown support for nested items
- **Right Section**: User avatar with dropdown menu for user actions
- **Features**: Responsive design, active/inactive states, complex dropdown menus

### Target Design Analysis (from Figma)

The DCMS header design is significantly simpler and more focused:

- **Left Section**: Triangle logo + "DCMS" text + horizontal navigation tabs
- **Center Section**: Navigation items "Data Centers" (active) and "Devices" (inactive)
- **Right Section**: Single star icon button
- **Styling**: Clean border bottom, consistent Inter typography, minimal spacing

### Key Differences Identified

1. **Navigation Complexity**: Current has dropdowns, target has simple tabs
2. **Branding**: Generic logo vs. specific triangle + DCMS branding
3. **User Actions**: Complex user menu vs. single action button
4. **Layout**: Responsive sidebar toggle vs. fixed horizontal layout

## Design Specifications from Figma

### Typography

- **DCMS Title**: Inter Bold, 18px, color: `#0d0f1c`
- **Active Navigation**: Inter Bold, 14px, color: `#0d0f1c`
- **Inactive Navigation**: Inter Medium, 14px, color: `#565a6f`

### Colors

- **Primary Text**: `#0d0f1c`
- **Secondary Text**: `#565a6f`
- **Border**: `#e5e8eb`

### Layout & Spacing

- **Container**: Full width with border-bottom
- **Padding**: 40px horizontal (px-10), 12px top, 13px bottom
- **Gaps**: 32px between logo and navigation, 36px between navigation items

### Assets

- **Logo**: Composite of two SVG vectors creating triangle shape
- **Icon Button**: Star icon with primary variant styling

## Implementation Plan

### Phase 1: Component Updates

#### 1. Update App Logo Component (`src/components/app-logo.tsx`)

**Changes Required:**

- Replace rounded rectangle SVG with triangle logo from Figma assets
- Update text from environment variable to hardcoded "DCMS"
- Apply Inter Bold 18px typography
- Use Figma-provided SVG assets (`imgVector0` and `imgVector1`)

#### 2. Create IconButton Component (`src/components/ui/icon-button.tsx`)

**New Component Needed:**

- Extend existing Button component architecture
- Support variant system (primary, secondary, etc.)
- Include proper ARIA attributes for accessibility
- Accept icon children and size props

#### 3. Update Menu Configuration (`src/config/menu.ts`)

**Changes Required:**

- Replace current menu items with DCMS navigation:
  - "Data Centers" (default active)
  - "Devices" (inactive)
- Remove icon properties from menu items
- Simplify structure (remove nested items support)

#### 4. Refactor AppHeader Component (`src/components/app-header.tsx`)

**Major Refactoring Required:**

- Remove sidebar toggle functionality
- Remove user avatar dropdown section
- Simplify navigation to horizontal tabs
- Add star icon button to right side
- Update layout to match Figma spacing exactly
- Apply proper typography weights and colors

### Phase 2: Styling Updates

#### Font Loading

- Ensure Inter font family is properly loaded
- Configure Bold and Medium weights
- Update CSS custom properties if needed

#### Color System

- Add DCMS-specific colors to theme or use directly
- Ensure proper contrast ratios for accessibility

#### Layout Adjustments

- Remove responsive sidebar behavior
- Implement fixed horizontal layout
- Match exact padding and spacing from design

### Phase 3: Testing Updates

#### Unit Tests

- Update `src/components/__tests__/app-header.test.tsx`
- Add tests for new IconButton component
- Test navigation state changes
- Test accessibility attributes

#### E2E Tests

- Update navigation tests for simplified structure
- Test header rendering and interactions
- Verify responsive behavior (if applicable)

## Technical Considerations

### Breaking Changes

1. **Navigation Structure**: Removal of dropdown menus may affect existing routes
2. **User Menu**: Removal of user avatar menu requires alternative user action patterns
3. **Sidebar**: Removal of sidebar toggle affects mobile navigation

### Accessibility Compliance

- Maintain WCAG 2.1 AA compliance
- Ensure proper focus management
- Include appropriate ARIA labels
- Maintain keyboard navigation support

### Performance Impact

- Simplified component tree should improve rendering performance
- Reduced dropdown logic eliminates unnecessary re-renders
- Static navigation structure enables better optimization

## Implementation Steps

### Step 1: Create New Components

1. Create `IconButton` component with proper TypeScript interfaces
2. Follow the development workflow from CLAUDE.md:
   - Run `npm run format` to format code with Prettier
   - Run `npm run lint` to check code style
   - Run `npm run typecheck` to verify TypeScript correctness
   - Run `npm run test:run` - All tests should pass (new component tests may be added)
   - Run `npm run test:e2e` - All tests should pass
3. Create unit tests using `.claude/commands/create_unit_tests.md` command patterns

### Step 2: Update Existing Components

1. Modify `AppLogo` component with new branding
2. Update menu configuration for DCMS navigation
3. Refactor `AppHeader` component layout
4. Follow the complete development workflow for each change:
   - Format → Lint → TypeCheck → Unit Tests → E2E Tests
5. Update existing tests as components change

### Step 3: Styling Integration

1. Apply exact Figma styling specifications
2. Ensure responsive behavior where needed
3. Test cross-browser compatibility
4. Complete development workflow validation cycle
5. Verify all tests still pass after styling changes

### Step 4: Testing and Validation

1. Update all existing tests using `.claude/commands/create_unit_tests.md` patterns
2. Add new test coverage for IconButton component
3. Update E2E tests using `.claude/commands/create_e2e_tests.md` patterns
4. Run complete validation: Format → Lint → TypeCheck → Unit Tests → E2E Tests
5. Validate accessibility compliance
6. Use Mock Service Worker (mswjs.io) if backend data mocking is needed

### Step 5: Documentation and Cleanup

1. Update component documentation following JSDoc standards
2. Remove unused imports and dependencies
3. Clean up any deprecated code patterns
4. Final development workflow validation
5. Ensure all tests pass in both unit and E2E suites

## Updated Business Context

Based on the updated CLAUDE.md requirements, this header conversion aligns with the DCMS (Data Centers Management System) business goals:

### DCMS Application Purpose

- **Primary Function**: Control physical mobile devices across multiple Data Centers worldwide
- **Target Users**: System administrators managing device infrastructure
- **Core Features**: DC management and Device management with operations for connection/disconnection

### Navigation Alignment with Business Logic

- **"Data Centers" Tab**: Aligns with DC management functionality (List, Add, Modify, Remove DCs)
- **"Devices" Tab**: Supports device management with search, filtering, and operations
- **Simplified Header**: Appropriate for admin interface focused on operational efficiency

### Development Standards Integration

- **Testing Requirements**: Must follow both unit test and E2E test validation per workflow
  - Unit tests: Use `.claude/commands/create_unit_tests.md` patterns
  - E2E tests: Use `.claude/commands/create_e2e_tests.md` patterns
  - Mock backend data with Mock Service Worker (mswjs.io) when needed
- **Component Architecture**: Must use TanStack patterns for future table/form implementation
- **Accessibility**: Critical for enterprise admin tools used by multiple operators
- **Development Workflow**: Strict Format → Lint → TypeCheck → Unit Tests → E2E Tests cycle

## Expected Outcomes

After implementation, the header will:

- Match the DCMS Figma design pixel-perfectly
- Provide simplified navigation appropriate for device management
- Maintain accessibility and performance standards
- Support the planned DCMS feature set (Data Centers and Devices)
- Use consistent typography and branding throughout
- Follow the strict development workflow with complete test coverage
- Prepare foundation for future TanStack Table/Form integration

## Risks and Mitigations

### Risk: User Action Accessibility

**Issue**: Removing user menu limits user actions
**Mitigation**: Implement user actions in different part of UI or add back minimal user menu

### Risk: Mobile Navigation

**Issue**: Removing sidebar toggle affects mobile experience
**Mitigation**: Evaluate if mobile-specific navigation is needed for DCMS use case

### Risk: Route Dependencies

**Issue**: Existing routes may depend on current menu structure
**Mitigation**: Audit all routes and update Router configuration accordingly

## Success Criteria

1. **Visual Accuracy**: Header matches Figma design exactly
2. **Functionality**: Navigation works correctly for DCMS features
3. **Performance**: No performance regressions from changes
4. **Accessibility**: Maintains or improves accessibility compliance
5. **Testing**: All tests pass with appropriate coverage
6. **Documentation**: Clear documentation for future maintenance

---

_This document serves as the blueprint for converting the generic sample application header into the specialized DCMS header design. All implementation should follow this plan to ensure consistency and completeness._
