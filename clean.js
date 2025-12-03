import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const releasePath = path.resolve(__dirname, '../release');

function deleteFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      deleteFiles(fullPath); // recurse
    } else if (entry.isFile()) {
      if (fullPath.endsWith('.js') || fullPath.endsWith('.d.ts')) {
        fs.unlinkSync(fullPath);
      }
    }
  }

  // after cleaning, check if directory is empty and remove it
  const remaining = fs.readdirSync(dir);
  if (remaining.length === 0) {
    fs.rmdirSync(dir);
  }
}

if (fs.existsSync(releasePath)) {
  console.log(`Cleaning ${releasePath} ...`);
  deleteFiles(releasePath);
  console.log('Cleanup complete.');
} else {
  console.log(`Path does not exist: ${releasePath}`);
}
