#!/usr/bin/env node
// Prints a `salt:hash` pair for one admin password, to paste into .env.local
// as ADMIN_DHRUV_PASSWORD_HASH / ADMIN_NUPUR_PASSWORD_HASH. The plaintext
// password itself is never written anywhere.
//
// Usage: node scripts/hash-admin-password.mjs "the-password"

import { randomBytes, scryptSync } from 'node:crypto';

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs "the-password"');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);

console.log(`${salt.toString('hex')}:${hash.toString('hex')}`);
