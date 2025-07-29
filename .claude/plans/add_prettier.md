# Plan: Add Prettier to React Shadcn Starter Project

## Overview

Add Prettier code formatting to the project with proper ESLint integration, ensuring they work together without conflicts.

## Steps

### 1. Install Prettier Dependencies

- Install `prettier` as dev dependency
- Install `eslint-config-prettier` to disable ESLint formatting rules that conflict with Prettier
- Install `eslint-plugin-prettier` to run Prettier as an ESLint rule

### 2. Create Prettier Configuration

- Create `.prettierrc.json` with basic configuration that you can customize
- Create `.prettierignore` to exclude build directories and other files

### 3. Update ESLint Configuration

- Modify `eslint.config.js` to integrate with Prettier
- Add `eslint-config-prettier` to disable conflicting rules
- Add `eslint-plugin-prettier` to run Prettier through ESLint

### 4. Add NPM Scripts

- Add `format` script to run Prettier
- Add `format:check` script to check formatting without fixing
- Update `lint` script to also check Prettier formatting

### 5. Update CLAUDE.md

- Add the new `format` commands to the development commands section
- Update the development workflow to include formatting step
- Document that Prettier is now part of the linting process

### 6. Format Existing Code

- Run Prettier on the entire codebase to ensure consistency
- This will likely change formatting in existing files to match Prettier rules

## Expected Changes

- Some existing files will be reformatted to match Prettier's style
- ESLint and Prettier will work together without conflicts
- New `format` commands will be available for code formatting
- Development workflow will include automatic formatting checks

## Implementation Details

### Dependencies to Install

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

### .prettierrc.json Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### .prettierignore Content

```
dist/
node_modules/
coverage/
*.min.js
*.min.css
```

### ESLint Configuration Updates

Add to `eslint.config.js`:

- Extend with `eslint-config-prettier`
- Add `eslint-plugin-prettier` plugin
- Add Prettier rule configuration

### NPM Scripts to Add

```json
{
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "lint": "eslint . && prettier --check ."
}
```

### CLAUDE.md Updates

- Add formatting commands to Development Commands section
- Update development workflow to include `npm run format` step
- Document integration between ESLint and Prettier
