import inquirer from 'inquirer';
import { writeConfig } from '../utils/config';
import { Config } from '../types';

export async function init(): Promise<void> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'source',
      message: 'Path to source file (e.g., .env):',
      default: '.env',
    },
    {
      type: 'input',
      name: 'encrypted',
      message: 'Path to encrypted file (e.g., .encryptenv):',
      default: '.encryptenv',
    },
    {
      type: 'input',
      name: 'key_hint',
      message: 'Optional key hint (not stored securely):',
    },
  ]);

  const config: Config = {
    source: answers.source,
    encrypted: answers.encrypted,
    encryption: 'aes-256-cbc',
    key_hint: answers.key_hint || undefined,
  };

  writeConfig(config);
  console.log('Configuration saved to envsync.config.json');
}