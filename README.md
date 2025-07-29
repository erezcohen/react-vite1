# React Vite Starter

React + Vite template

## Getting Started

```bash
npx degit erezcohen/react-vite1 my-project
cd my-project
npm install
npm run dev
```

## Features

- React + Vite
- TypeScript
- Tailwind CSS V4
- [shadcn-ui](https://github.com/shadcn-ui/ui/)
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)
- Playwright for E2E tests
- Vitest + RTL for unit / integration tests
- Prettier + Eslint
- Responsive

## Project Structure

```md
root/
├── .claude/ # Claude Code settings and configurations
├── public/ # Public assets
├── src/ # Application source code
│ ├── components/ # React components
│ ├── config/ # Configuration data
│ ├── contexts/ # React context providers
│ ├── hooks/ # Custom React hooks
│ ├── lib/ # Utility functions
│ ├── pages/ # Page/feature components
│ ├── test/ # Test utilities and setup
│ ├── App.tsx # Application entry point
│ ├── index.css # Main CSS and Tailwind configuration
│ ├── main.tsx # Main rendering file
│ ├── Router.tsx # Routes component
│ └── vite-env.d.ts # Vite environment types
├── CLAUDE.md # Claude Code guidance documentation
├── components.json # shadcn/ui configuration
├── eslint.config.js # ESLint configuration
├── index.html # HTML entry point
├── playwright.config.ts # Playwright configuration
├── tsconfig.json # TypeScript configuration
├── tsconfig.app.json # App-specific TypeScript config
├── tsconfig.node.json # Node-specific TypeScript config
├── vite.config.ts # Vite configuration
└── vitest.config.ts # Vitest configuration
```

## License

This project is licensed under the MIT License.

## Credits

Base source: https://github.com/hayyi2/react-shadcn-starter
