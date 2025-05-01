import inquirer from 'inquirer';
import { readConfig } from '../utils/config';
import { readFile, writeFile } from '../utils/file';
import { encrypt } from '../utils/crypto';

export async function encryptCommand(): Promise<void> {
  const config = readConfig();
  const { passphrase } = await inquirer.prompt([
    { type: 'password', name: 'passphrase', message: 'Enter passphrase:' },
  ]);

  const data = readFile(config.source);
  const encrypted = encrypt(data, passphrase);
  writeFile(config.encrypted, JSON.stringify(encrypted, null, 2));
  console.log(`Encrypted ${config.source} to ${config.encrypted}`);
}