import inquirer from 'inquirer';
import { readConfig } from '../utils/config';
import { readEncryptedFile, writeFile } from '../utils/file';
import { decrypt } from '../utils/crypto';

export async function decryptCommand(): Promise<void> {
  const config = readConfig();
  const { passphrase } = await inquirer.prompt([
    { type: 'password', name: 'passphrase', message: 'Enter passphrase:' },
  ]);

  const encrypted = readEncryptedFile(config.encrypted);
  const decrypted = decrypt(encrypted.data, passphrase);
  writeFile(config.source, decrypted);
  console.log(`Decrypted ${config.encrypted} to ${config.source}`);
}