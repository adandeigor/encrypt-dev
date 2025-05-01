import inquirer from 'inquirer';
import { readConfig } from '../utils/config';
import { readEncryptedFile, writeFile } from '../utils/file';
import { decrypt, encrypt } from '../utils/crypto';

export async function rotateKeyCommand(): Promise<void> {
  const config = readConfig();
  const { oldPassphrase, newPassphrase } = await inquirer.prompt([
    { type: 'password', name: 'oldPassphrase', message: 'Enter current passphrase:' },
    { type: 'password', name: 'newPassphrase', message: 'Enter new passphrase:' },
  ]);

  const encrypted = readEncryptedFile(config.encrypted);
  const decrypted = decrypt(encrypted.data, oldPassphrase);
  const newEncrypted = encrypt(decrypted, newPassphrase);
  writeFile(config.encrypted, JSON.stringify(newEncrypted, null, 2));
  console.log(`Rotated key for ${config.encrypted}`);
}