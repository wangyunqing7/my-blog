import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const postsDirectory = path.resolve('src/content/posts');
const files = (await readdir(postsDirectory)).filter((file) => file.endsWith('.md'));
const errors = [];

for (const file of files) {
  const source = await readFile(path.join(postsDirectory, file), 'utf8');
  const frontmatterEnd = source.indexOf('\n---', 4);
  const body = frontmatterEnd >= 0 ? source.slice(frontmatterEnd + 4) : source;

  if (/^comments:\s*(?:true|false)\s*$/m.test(body)) {
    errors.push(`${file}: 正文中包含 comments 配置，请只在 frontmatter 中设置`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Content check passed (${files.length} posts).`);
