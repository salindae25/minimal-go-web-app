#!/usr/bin/env node
// Discover packages through Go; pass paths as arguments so spaces remain safe.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const formatRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const formatDirs = execFileSync('go', ['list', '-f', '{{.Dir}}', './...'], {
  cwd: formatRoot,
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .filter(Boolean);
const formatFiles = formatDirs.flatMap((dir) =>
  fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.go'))
    .map((name) => path.join(dir, name)),
);
const formatWrite = process.argv.includes('--write');
const formatOutput = execFileSync('gofmt', [formatWrite ? '-w' : '-l', ...formatFiles], {
  cwd: formatRoot,
  encoding: 'utf8',
});
if (!formatWrite && formatOutput.trim()) {
  process.stderr.write(formatOutput);
  throw new Error('Go formatting differs. Run make format.');
}
