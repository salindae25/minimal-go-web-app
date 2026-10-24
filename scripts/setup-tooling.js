#!/usr/bin/env node
// npm packages can ship Go examples. A module boundary keeps them out of ./....
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolingRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const toolingModules = path.join(toolingRoot, 'node_modules');
fs.mkdirSync(toolingModules, { recursive: true });
fs.writeFileSync(path.join(toolingModules, 'go.mod'), 'module frontend-tooling\n');
