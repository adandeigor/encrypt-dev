import { promises as fs } from 'fs';
import inquirer from 'inquirer';
import { loadConfig } from './config';
import { encryptFile } from '../utils/crypto';
import { CommandOptions, ProfileConfig } from '../types';

 async function encrypt(options: CommandOptions): Promise<void> {
  try {
    const config = await loadConfig();
    const profile = options.profile || 'default';
    const profileConfig = config.profiles[profile];

    if (!profileConfig) {
      throw new Error(`Profil ${profile} non trouvé dans envsync.config.json`);
    }

    if (options.all) {
      for (const p in config.profiles) {
        await encryptProfile(config.profiles[p]);
      }
    } else {
      await encryptProfile(profileConfig);
    }
  } catch (error: any) {
    console.error(`Erreur lors du chiffrement : ${error.message}`);
    process.exit(1);
  }
}

async function encryptProfile({ source, encrypted }: ProfileConfig): Promise<void> {
  const key = await getKey();
  const content = await fs.readFile(source, 'utf8');
  const encryptedContent = await encryptFile(content, key);
  await fs.writeFile(encrypted, encryptedContent);
  console.log(`Fichier ${source} chiffré en ${encrypted}`);
}

async function getKey(): Promise<string> {
  try {
    const keyFile = await fs.readFile('.envsync.key', 'utf8').catch(() => null);
    if (keyFile) return keyFile;
    const { key } = await inquirer.prompt<{ key: string }>([
      { type: 'password', name: 'key', message: 'Entrez la clé de chiffrement :' }
    ]);
    return key;
  } catch (error: any) {
    throw new Error('Impossible de récupérer la clé.');
  }
}

export { encrypt, encryptProfile };