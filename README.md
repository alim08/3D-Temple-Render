# My Portfolio (`my-port`)

A personal portfolio website built with [Vite](https://vitejs.dev/), React, and Three.js, powered by React Three Fiber and Drei for seamless 3D scene management.

## Features

- **Lightning-fast dev workflow** with Vite’s Hot Module Replacement (HMR) and minimal config  
- **3D rendering** using [`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber) and helper components from [`@react-three/drei`](https://github.com/pmndrs/drei)  
- **Type-aware linting** tailored for React, JSX, React Hooks, and Vite Fast Refresh  
- **Clean Git history** with a robust `.gitignore` for node modules, build artifacts, and editor files  

## Table of Contents

- [Prerequisites](#prerequisites)  
- [Getting Started](#getting-started)  
- [Available Scripts](#available-scripts)  
- [Project Structure](#project-structure)  
- [Configuration](#configuration)  
- [Contributing](#contributing)  
- [Credits](#credits)  
- [License](#license)  

## Prerequisites

- **Node.js** v14 or higher  
- **npm** (or Yarn, pnpm)  

## Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/my-port.git
   cd my-port
   ```  
2. **Install dependencies**  
   ```bash
   npm install
   ```  
3. **Start development server**  
   ```bash
   npm run dev
   ```  
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

All commands are defined in `package.json`:

| Script           | Description                               |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Start Vite dev server with HMR            |
| `npm run build`  | Bundle app for production                 |
| `npm run preview`| Preview the production build locally      |
| `npm run lint`   | Run ESLint across source files            |

## Project Structure

```
├── .gitignore
├── index.html
├── README.md
├── vite.config.js
├── eslint.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── components/
│       └── Your3DScene.jsx
└── public/
```

- **`.gitignore`**: Excludes `node_modules`, `dist`, logs, and editor files  
- **`index.html`**: Entry point mounting `<div id="root">` and loading `src/main.jsx`  
- **`vite.config.js`**: Enables React plugin for Vite  
- **`eslint.config.js`**: Lint rules for JS/JSX, React Hooks, and Vite Fast Refresh  

## Configuration

### Vite

Configured via `vite.config.js` with the official React plugin for fast refresh and JSX support.

### ESLint

Uses base rules from `@eslint/js`, plus plugins for React Hooks and React Refresh:

```js
// eslint.config.js
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  js.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn'
    }
  }
];
```

## Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m 'Add feature'`)  
4. Push to the branch (`git push origin feature/YourFeature`)  
5. Open a Pull Request  

Ensure all new code is lint-clean (`npm run lint`) and builds without errors (`npm run build`).

## Credits

3D model **“Parthenon”** by **Bulat**, from [Sketchfab](https://skfb.ly/oAWUY), is licensed under [Creative Commons Attribution 4.0](http://creativecommons.org/licenses/by/4.0/).

## License

Distributed under the MIT License. See `LICENSE` for more information.

