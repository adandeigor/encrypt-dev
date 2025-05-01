import inquirer from 'inquirer';
import { readConfig } from '../utils/config';
import { checkSyncStatus } from '../utils/file';

export async function statusCommand(): Promise<void> {
  const config = readConfig();
  const { passphrase } = await inquirer.prompt([
    { type: 'password', name: 'passphrase', message: 'Enter passphrase for verification:' },
  ]);

  const { isSynced, message } = checkSyncStatus(config.source, config.encrypted, passphrase);
  console.log(message);
  if (!isSynced) {
    console.log('Run `encrypt` to update .encryptenv or `decrypt` to update .env.');
  }
}