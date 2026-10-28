import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // These effects synchronize external data, browser preferences, and animations.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  globalIgnores(['.next/**', 'studio/node_modules/**', 'studio/dist/**', 'studio/.sanity/**', '.agents/**', '.codex/**']),
]);
