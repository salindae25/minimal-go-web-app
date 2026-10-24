#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createServer } from 'vite';

const developmentServer = await createServer();
// Detached process groups let shutdown also reach the executable spawned by go run.
const developmentGrouped = process.platform !== 'win32';
const developmentAPI = spawn('go', ['run', '.', '-dev'], {
  stdio: 'inherit',
  detached: developmentGrouped,
  env: { ...process.env, HOST: process.env.HOST || '127.0.0.1' },
});
let developmentClosing = false;
async function closeDevelopment(code = 0) {
  if (developmentClosing) return;
  developmentClosing = true;
  process.exitCode = code;
  if (developmentAPI.exitCode === null) {
    try {
      if (developmentGrouped) process.kill(-developmentAPI.pid, 'SIGTERM');
      else developmentAPI.kill('SIGTERM');
    } catch (error) {
      if (error.code !== 'ESRCH') console.error(error);
    }
  }
  await developmentServer.close();
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => void closeDevelopment());
developmentAPI.once('error', (error) => {
  console.error(error);
  void closeDevelopment(1);
});
developmentAPI.once('exit', (code) => {
  if (!developmentClosing) void closeDevelopment(code || 1);
});
try {
  await developmentServer.listen();
  developmentServer.printUrls();
} catch (error) {
  console.error(error);
  await closeDevelopment(1);
}
