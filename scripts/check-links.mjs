import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const distDirectory = path.resolve('dist');

async function listHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listHtmlFiles(fullPath) : [fullPath];
  }));
  return nested.flat().filter((file) => file.endsWith('.html'));
}

function resolveTarget(reference) {
  const cleanReference = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
  if (cleanReference === '/') return path.join(distDirectory, 'index.html');

  const relativePath = cleanReference.replace(/^\/+/, '');
  if (path.extname(relativePath)) return path.join(distDirectory, relativePath);
  return path.join(distDirectory, relativePath, 'index.html');
}

const missing = [];
const htmlFiles = await listHtmlFiles(distDirectory);

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (!reference.startsWith('/') || reference.startsWith('//')) continue;

    const target = resolveTarget(reference);
    if (!existsSync(target)) {
      missing.push(`${path.relative(distDirectory, htmlFile)} -> ${reference}`);
    }
  }
}

if (missing.length > 0) {
  console.error(`Broken internal references:\n${[...new Set(missing)].join('\n')}`);
  process.exit(1);
}

console.log(`Link check passed (${htmlFiles.length} HTML files).`);
