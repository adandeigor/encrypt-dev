import { promises as fs } from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { Config, ProfileConfig } from '../types';
import { selectFile } from '../utils/prompt';

// Chemin du fichier de configuration
const CONFIG_PATH: string = path.join(process.cwd(), 'envsync.config.json');

// Modèle de configuration par défaut
const defaultConfig: Config = {
  profiles: {
    default: {
      source: '.env',
      encrypted: '.encryptenv',
      encryption: 'aes-256-cbc',
      key_hint: ''
    }
  }
};

// Charge ou crée la configuration
async function loadConfig(): Promise<Config> {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    return JSON.parse(data) as Config;
  } catch (error) {
    await fs.writeFile(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
}

// Assistant interactif pour l’initialisation
async function init(): Promise<void> {
  try {
    const config = await loadConfig();
    const answers = await inquirer.prompt<{
      profile: string;
      source: string;
      encrypted: string;
      key_hint: string;
      saveKey: boolean;
    }>([
      {
        type: 'input',
        name: 'profile',
        message: 'Nom du profil (ex. : default, dev, prod) :',
        default: 'default'
      },
      {
        type: 'input',
        name: 'source',
        message: 'Fichier source à chiffrer (ex. : .env) :',
        default: '.env',
        validate: async (input: string) => {
          const exists = await fs.access(input).then(() => true).catch(() => false);
          return exists ? true : 'Le fichier n’existe pas.';
        }
      },
      {
        type: 'input',
        name: 'encrypted',
        message: 'Nom du fichier chiffré (ex. : .encryptenv) :',
        default: '.encryptenv'
      },
      {
        type: 'input',
        name: 'key_hint',
        message: 'Indice pour la clé (facultatif) :'
      },
      {
        type: 'confirm',
        name: 'saveKey',
        message: 'Voulez-vous sauvegarder la clé dans .envsync.key ? (non committé)',
        default: false
      }
    ]);

    config.profiles[answers.profile] = {
      source: answers.source,
      encrypted: answers.encrypted,
      encryption: 'aes-256-cbc',
      key_hint: answers.key_hint
    };

    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
    if (answers.saveKey) {
      const { key } = await inquirer.prompt<{ key: string }>([
        { type: 'password', name: 'key', message: 'Entrez la clé de chiffrement :' }
      ]);
      await fs.writeFile(path.join(process.cwd(), '.envsync.key'), key);
      await fs.appendFile(path.join(process.cwd(), '.gitignore'), '\n.envsync.key');
    }
    console.log('Configuration sauvegardée dans envsync.config.json');
  } catch (error: any) {
    console.error(`Erreur lors de l’initialisation : ${error.message}`);
    process.exit(1);
  }
}

export { loadConfig, init };