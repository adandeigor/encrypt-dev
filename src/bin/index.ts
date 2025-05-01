#!/usr/bin/env node
import { program } from 'commander';
import { init } from '../lib/config';
import { encrypt } from '../lib/encrypt';
import { decrypt } from '../lib/decrypt';
import { status } from '../lib/status';
import { watch } from '../lib/watch';
import { CommandOptions } from '../types';

// Importation du fichier package.json pour récupérer la version
const pkg = require('../../package.json');
import { rotateKey } from '../lib/rotate-key';
import { generateKey } from 'crypto';

// Définit la version et la description du CLI
program
  .version(pkg.version)
  .description('envsync-cli : Outil de synchronisation sécurisée des fichiers .env');

// Commande : init
program
  .command('init')
  .description('Configure le projet via un assistant interactif')
  .action(init);

// Commande : encrypt
program
  .command('encrypt')
  .description('Chiffre un fichier sensible en .encryptenv')
  .option('--profile <profile>', 'Profil à utiliser (ex. : dev, prod)')
  .option('--all', 'Chiffre tous les fichiers configurés')
  .action((options: CommandOptions) => encrypt(options));

// Commande : decrypt
program
  .command('decrypt')
  .description('Déchiffre un fichier .encryptenv')
  .option('--profile <profile>', 'Profil à utiliser (ex. : dev, prod)')
  .option('--all', 'Déchiffre tous les fichiers configurés')
  .action((options: CommandOptions) => decrypt(options));

// Commande : status
program
  .command('status')
  .description('Vérifie la synchronisation des fichiers')
  .action(status);

// Commande : rotate-key
program
  .command('rotate-key')
  .description('Rechiffre avec une nouvelle clé')
  .option('--profile <profile>', 'Profil à utiliser (ex. : dev, prod)')
  .action((options: CommandOptions) => rotateKey(options));

// Commande : generate-key
program
  .command('generate-key')
  .description('Génère une clé aléatoire et affiche un QR code')
  .action(generateKey);

// Commande : watch
program
  .command('watch')
  .description('Surveille les modifications et rechiffre automatiquement')
  .option('--profile <profile>', 'Profil à utiliser (ex. : dev, prod)')
  .action((options: CommandOptions) => watch(options));

// Commande : help
program
  .command('help')
  .description('Affiche l’aide et les exemples')
  .action(() => program.outputHelp());

program.parse(process.argv);