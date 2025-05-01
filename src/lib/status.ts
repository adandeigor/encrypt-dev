import { promises as fs } from 'fs';
import { loadConfig } from './config';
import { decryptFile } from '../utils/crypto';
import { ProfileConfig } from '../types';
import inquirer from 'inquirer';

async function status(): Promise<void> {
  try {
    const config = await loadConfig();
    for (const profile in config.profiles) {
      const profileConfig = config.profiles[profile];
      await checkProfileStatus(profile, profileConfig);
    }
  } catch (error: any) {
    console.error(`Erreur lors de la vérification du statut : ${error.message}`);
    process.exit(1);
  }
}

async function checkProfileStatus(profile: string, { source, encrypted }: ProfileConfig): Promise<void> {
  try {
    const sourceExists = await fs.access(source).then(() => true).catch(() => false);
    const encryptedExists = await fs.access(encrypted).then(() => true).catch(() => false);

    if (!sourceExists && !encryptedExists) {
      console.log(`Profil ${profile} : Aucun fichier trouvé.`);
      return;
    }

    if (encryptedExists) {
      console.log(`Profil ${profile} : Fichier chiffré (${encrypted}) trouvé.`);
      try {
        const key = await getKey();
        const encryptedContent = await fs.readFile(encrypted, 'utf8');
        await decryptFile(encryptedContent, key);
        console.log(`Profil ${profile} : Fichier chiffré valide.`);
      } catch (error) {
        console.log(`Profil ${profile} : Fichier chiffré non déchiffrable (clé incorrecte ?).`);
      }
    }

    if (sourceExists && !encryptedExists) {
      console.log(`Profil ${profile} : Fichier source (${source}) non chiffré. Exécutez 'encrypt'.`);
    }
  } catch (error: any) {
    console.log(`Profil ${profile} : Erreur lors de la vérification.`);
  }
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

export { status };