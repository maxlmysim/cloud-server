// rootDir.js
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
export const rootDir = path.dirname(__filename);

