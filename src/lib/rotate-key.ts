import { promises as fs } from 'fs';
import inquirer from 'inquirer';
import { loadConfig } from './config';
import { decryptFile, encryptFile } from '../utils/crypto';
import { CommandOptions, ProfileConfig } from '../types';

async function rotateKey(options: CommandOptions): Promise<void> {
  try {
    const config = await loadConfig();
    const profile = options.profile || 'default';
    const profileConfig = config.profiles[profile];

    if (!profileConfig) {
      throw new Error(`Profil ${profile} non trouvé dans envsync.config.json`);
    }

    const oldKey = await getKey('ancienne clé');
    const { newKey } = await inquirer.prompt<{ newKey: string }>([
      { type: 'password', name: 'newKey', message: 'Entrez la nouvelle clé de chiffrement :' }
    ]);

    const encryptedContent = await fs.readFile(profileConfig.encrypted, 'utf8');
    const decryptedContent = await decryptFile(encryptedContent, oldKey);
    const newEncryptedContent = await encryptFile(decryptedContent, newKey);
    await fs.writeFile(profileConfig.encrypted, newEncryptedContent);

    console.log(`Clé tournée avec succès pour le profil ${profile}`);
  } catch (error: any) {
    console.error(`Erreur lors de la rotation de clé : ${error.message}`);
    process.exit(1);
  }
}

async function getKey(promptMessage: string): Promise<string> {
  try {
    const keyFile = await fs.readFile('.envsync.key', 'utf8').catch(() => null);
    if (keyFile) return keyFile;
    const { key } = await inquirer.prompt<{ key: string }>([
      { type: 'password', name: 'key', message: `Entrez ${promptMessage} :` }
    ]);
    return key;
  } catch (error: any) {
    throw new Error('Impossible de récupérer la clé.');
  }
}

export { rotateKey };