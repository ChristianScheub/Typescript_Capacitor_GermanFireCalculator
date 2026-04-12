# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Used NPM Libs
<br />├── @capacitor/cli@8.3.0
<br />├── @capacitor/core@8.3.0
<br />├── @capacitor/ios@8.3.0
<br />├── @capacitor/share@8.0.1
<br />├── @emnapi/wasi-threads@1.2.1 extraneous
<br />├── @eslint/js@9.39.4
<br />├── @types/jest@30.0.0
<br />├── @types/node@24.12.2
<br />├── @types/react-dom@19.2.3
<br />├── @types/react@19.2.14
<br />├── @vitejs/plugin-react@6.0.1
<br />├── eslint-plugin-react-hooks@7.0.1
<br />├── eslint-plugin-react-refresh@0.5.2
<br />├── eslint@9.39.4
<br />├── globals@17.4.0
<br />├── i18next@26.0.3
<br />├── license-checker@25.0.1
<br />├── react-dom@19.2.4
<br />├── react-i18next@17.0.2
<br />├── react@19.2.4
<br />├── typescript-eslint@8.58.0
<br />├── typescript@6.0.2
<br />└── vite@8.0.4