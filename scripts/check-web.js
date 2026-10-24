#!/usr/bin/env node
// Syntax validation for the small flat web/src module directory and its bundle.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const checkRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checkSrc = path.join(checkRoot, 'web/src');
const checkFiles = fs.readdirSync(checkSrc).filter((file) => file.endsWith('.js'));
for (const file of checkFiles) {
  const fullPath = path.join(checkSrc, file);
  execFileSync(process.execPath, ['--check', fullPath], { stdio: 'inherit' });
  const source = fs.readFileSync(fullPath, 'utf8');
  for (const match of source.matchAll(/(?:import|from)\s+['"](\.[^'"]+)['"]/g)) {
    const resolved = path.resolve(path.dirname(fullPath), match[1]);
    if (!fs.existsSync(resolved)) throw new Error(`Broken import in ${file}: ${match[1]}`);
  }
}
for (const asset of ['web/app.js', 'web/theme-init.js']) {
  execFileSync(process.execPath, ['--check', path.join(checkRoot, asset)], { stdio: 'inherit' });
}
console.log(`Checked ${checkFiles.length} source modules and web/app.js.`);
