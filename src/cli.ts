#!/usr/bin/env node

import { Command } from 'commander';
import { init } from './commands/init';
import { encryptCommand } from './commands/encrypt';
import { decryptCommand } from './commands/decrypt';
import { statusCommand } from './commands/status';
import { rotateKeyCommand } from './commands/rotate-key';
import { generateKeyCommand } from './commands/generate-key';
import { watchCommand } from './commands/watch';
import { helpCommand } from './commands/help';
import { EnvsyncError } from './types';

const program = new Command();

program
  .name('envsync-cli')
  .description('CLI tool for encrypting and managing environment files')
  .version('1.0.0');

program.command('init').description('Initialize project').action(async () => {
  try {
    await init();
  } catch (err) {
    console.error(err instanceof EnvsyncError ? err.message : 'Unknown error');
    process.exit(1);
  }
});

program.command('encrypt').description('Encrypt .env').action(async () => {
  try {
    await encryptCommand();
  } catch (err) {
    console.error(err instanceof EnvsyncError ? err.message : 'Unknown error');
    process.exit(1);
  }
});

program.command('decrypt').description('Decrypt .encryptenv').action(async () => {
  try {
    await decryptCommand();
  } catch (err) {
    console.error(err instanceof EnvsyncError ? err.message : 'Unknown error');
    process.exit(1);
  }
});

program.command('status').description('Check sync status').action(async () => {
  try {
    await statusCommand();
  } catch (err) {
    console.error(err instanceof EnvsyncError ? err.message : 'Unknown error');
    process.exit(1);
  }
});

program.command('rotate-key').description('Rotate encryption key').action(async () => {
  try {
    await rotateKeyCommand();
  } catch (err) {
    console.error(err instanceof EnvsyncError ? err.message : 'Unknown error');
    process.exit(1);
  }
});

program.command('generate-key').description('Generate random key').action(async () => {
  try {
    await generateKeyCommand();
  } catch (err) {
    console.error(err instanceof EnvsyncError ? err.message : 'Unknown error');
    process.exit(1);
  }
});

program.command('watch').description('Watch .env for changes').action(async () => {
  try {
    await watchCommand();
  } catch (err) {
    console.error(err instanceof EnvsyncError ? err.message : 'Unknown error');
    process.exit(1);
  }
});

program.command('help').description('Show help').action(helpCommand);

program.parse(process.argv);