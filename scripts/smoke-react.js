#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import net from 'node:net';

const root = new URL('..', import.meta.url).pathname;
const temp = await mkdtemp(join(tmpdir(), 'minimal-go-smoke-'));
const binary = join(temp, 'server');
const port = await new Promise((resolve, reject) => {
  const probe = net.createServer();
  probe.listen(0, '127.0.0.1', () => {
    const { port } = probe.address();
    probe.close((error) => (error ? reject(error) : resolve(port)));
  });
});
let child;
try {
  const build = spawn('go', ['build', '-o', binary, '.'], { cwd: root, stdio: 'inherit' });
  const [buildCode] = await once(build, 'exit');
  if (buildCode !== 0) throw new Error(`go build failed: ${buildCode}`);
  child = spawn(binary, [], {
    cwd: temp,
    env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) },
    stdio: 'ignore',
  });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('server did not start')), 5000);
    const check = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/react/`);
        const html = await response.text();
        if (!response.ok || !html.includes('app.js') || !html.includes('index.css'))
          throw new Error('React HTML/assets missing');
        for (const path of ['/react/app.js', '/react/index.css', '/api/hello']) {
          const result = await fetch(`http://127.0.0.1:${port}${path}`);
          if (!result.ok) throw new Error(`${path}: ${result.status}`);
          const body = await result.text();
          if (path === '/api/hello' && !body.includes('Hello from Go.'))
            throw new Error('API payload mismatch');
        }
        clearTimeout(timeout);
        resolve();
      } catch (error) {
        if (error.cause?.code === 'ECONNREFUSED') setTimeout(check, 100);
        else {
          clearTimeout(timeout);
          reject(error);
        }
      }
    };
    check();
  });
  console.log('Production React smoke test passed');
} finally {
  child?.kill('SIGTERM');
  if (child) await once(child, 'exit');
  await rm(temp, { recursive: true, force: true });
}
