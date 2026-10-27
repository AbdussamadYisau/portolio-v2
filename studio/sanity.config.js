import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'portfolio-work',
  title: 'Abdussamad Portfolio — Selected Work',
  projectId: 'ttil6cux',
  dataset: 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
