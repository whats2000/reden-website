import fs from 'fs';
import { execSync } from 'node:child_process';

const hash = execSync('git rev-parse --short HEAD').toString().trim();
fs.writeFileSync('assets/hash.json', `"${hash}-dev"`);
console.log('🎉[Reden] Initialized version info');
