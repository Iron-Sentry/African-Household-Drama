// File checks for tests/assets.test.ts (kept here so the TypeScript tests need no Node types).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/assets');

/** True when public/assets/<p> exists. */
export const assetExists = (p) => fs.existsSync(path.join(root, p));
