import { defineConfig, type Plugin } from 'vite';
// @ts-expect-error plain JS tooling module shared with the CLI and tests
import { compileInk, STORY_ENTRY } from './scripts/ink.mjs';
import { validateTags } from './src/content/validate.ts';

// Compiles story/*.ink into `virtual:story` on demand, so writers edit ink and
// the browser reloads with the new story (no separate compile step).
function ink(): Plugin {
  const id = 'virtual:story';
  const resolved = '\0' + id;
  return {
    name: 'ink',
    resolveId: (source) => (source === id ? resolved : null),
    load(source) {
      if (source !== resolved) return;
      const { json, meta, files, warnings } = compileInk(STORY_ENTRY);
      files.forEach((f: string) => this.addWatchFile(f));
      warnings.forEach((w: string) => this.warn(w));
      const problems = validateTags(meta.tags);
      if (problems.length) this.error(`Story tag problems:\n  ${problems.join('\n  ')}`);
      return `export const storyJson = ${JSON.stringify(json)};\nexport const meta = ${JSON.stringify({ knots: meta.knots, moments: meta.moments })};`;
    },
    handleHotUpdate({ file, server }) {
      if (!file.endsWith('.ink')) return;
      const mod = server.moduleGraph.getModuleById(resolved);
      if (mod) server.moduleGraph.invalidateModule(mod);
      server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [ink()],
  build: { target: 'es2020', chunkSizeWarningLimit: 700 },
  test: { include: ['tests/**/*.test.ts'] },
});
