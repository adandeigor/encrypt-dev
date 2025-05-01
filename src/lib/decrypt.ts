import { promises as fs } from 'fs';
import inquirer from 'inquirer';
import { loadConfig } from './config';
import { decryptFile } from '../utils/crypto';
import { CommandOptions, ProfileConfig } from '../types';

async function decrypt(options: CommandOptions): Promise<void> {
  try {
    const config = await loadConfig();
    const profile = options.profile || 'default';
    const profileConfig = config.profiles[profile];

    if (!profileConfig) {
      throw new Error(`Profil ${profile} non trouvé dans envsync.config.json`);
    }

    if (options.all) {
      for (const p in config.profiles) {
        await decryptProfile(config.profiles[p]);
      }
    } else {
      await decryptProfile(profileConfig);
    }
  } catch (error: any) {
    console.error(`Erreur lors du déchiffrement : ${error.message}`);
    process.exit(1);
  }
}

async function decryptProfile({ source, encrypted }: ProfileConfig): Promise<void> {
  const key = await getKey();
  const encryptedContent = await fs.readFile(encrypted, 'utf8');
  const decryptedContent = await decryptFile(encryptedContent, key);
  await fs.writeFile(source, decryptedContent);
  console.log(`Fichier ${encrypted} déchiffré en ${source}`);
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

export { decrypt };