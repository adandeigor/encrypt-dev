# envsync-cli

`envsync-cli` est un outil en ligne de commande pour gérer et partager des variables d'environnement de manière sécurisée. Il chiffre un fichier `.env` dans un fichier `.encryptenv` (avec AES-256-CBC) que vous pouvez inclure dans votre dépôt Git. Les développeurs accèdent aux variables en déchiffrant `.encryptenv` avec une passphrase sécurisée, partagée via un QR code ou un gestionnaire de secrets. La commande `rotate-key` permet de changer la passphrase en cas de compromission, sans modifier les variables.

## Table des matières

- Fonctionnalités
- Installation
- Configuration initiale
- Commandes
  - init
  - generate-key
  - encrypt
  - decrypt
  - status
  - rotate-key
- Partage des variables d'environnement
- Gestion d'une clé compromise
- Bonnes pratiques de sécurité
- Dépannage
- Contribuer
- Licence

## Fonctionnalités

- **Chiffrement sécurisé** : Protège les variables d'environnement avec AES-256-CBC.
- **Partage via Git** : Stocke `.encryptenv` dans le dépôt pour un accès facile.
- **Génération de clés** : Crée des passphrases sécurisées et des QR codes.
- **Rotation de clés** : Met à jour la passphrase sans changer les variables.
- **Vérification de synchronisation** : Confirme la cohérence entre `.env` et `.encryptenv`.
- **Interface intuitive** : Prompts interactifs pour une utilisation simple.

## Installation

1. **Prérequis** :

   - Node.js (version 16 ou supérieure)
   - npm (inclus avec Node.js)

2. **Installer globalement** (recommandé pour une utilisation en CLI) :

   ```bash
   npm install -g envsync-cli
   ```

3. **Vérifier l'installation** :

   ```bash
   envsync --help
   ```

   Cela affiche la liste des commandes disponibles.

4. **Installer localement** (optionnel, pour un projet spécifique) :

   ```bash
   npm install envsync-cli
   ```

   - Exécutez les commandes via `npx` :

     ```bash
     npx envsync --help
     ```

## Configuration initiale

Configurez `envsync-cli` dans votre projet pour gérer les variables d'environnement.

1. **Créer un fichier** `.env` :

   ```bash
   echo "API_KEY=xyz123\nDB_PASSWORD=secret\nPORT=3000" > .env
   ```

2. **Initialiser la configuration** :

   ```bash
   envsync init
   ```

   - **Prompts** :
     - Chemin du fichier source : `.env` (par défaut)
     - Chemin du fichier chiffré : `.encryptenv` (par défaut)
     - Algorithme de chiffrement : `aes-256-cbc` (par défaut)
     - Indice de clé (facultatif) : Un mémo pour la passphrase (par exemple, `prod-key`).
   - **Résultat** : Crée `envsync.config.json`, par exemple :

     ```json
     {
       "source": ".env",
       "encrypted": ".encryptenv",
       "encryption": "aes-256-cbc",
       "key_hint": "prod-key"
     }
     ```

3. **Générer une passphrase** :

   ```bash
   npx envsync generate-key
   ```

   - **Sortie** : Une passphrase hexadécimale (par exemple, `6ec8f388997aad6c738afd072e7812696ed1115fa5d442b440edf35bfef1ab52`) et un QR code.
   - **Action** : Notez la passphrase et partagez-la via un canal sécurisé (voir Partage des variables d'environnement).

4. **Chiffrer les variables** :

   ```bash
   npx envsync encrypt
   ```

   - Entrez la passphrase.
   - **Résultat** : Crée `.encryptenv`, par exemple :

     ```json
     {
       "iv": "fa7c2c2f33b1683f1a4bb6e56a0fe200",
       "salt": "73b5eb3e7e90c23b1a7fdd36b397a9ad",
       "hash": "b7326389778812552eb7b181d198074058eb44bebf6ae86c3b7efad6bbed5da5",
       "content": "11bfe603806aa5d59ba1dbd0873051cc"
     }
     ```

5. **Ajouter** `.encryptenv` **au dépôt** :

   ```bash
   git add .encryptenv envsync.config.json
   git commit -m "Add encrypted environment file and config"
   git push
   ```

**Note** : Assurez-vous que `.env` est dans `.gitignore` :

```bash
# .gitignore
.env
node_modules/
```

## Commandes 

### init

Crée `envsync.config.json` pour configurer le CLI.

```bash
envsync init
```

- **Prompts** : Chemin du fichier source, fichier chiffré, algorithme, indice de clé.
- **Résultat** : Génère `envsync.config.json`.

### generate-key

Génère une passphrase sécurisée et un QR code.

```bash
envsync generate-key
```

- **Sortie** :

  ```
  Generated Key: 6ec8f388997aad6c738afd072e7812696ed1115fa5d442b440edf35bfef1ab52
  QR Code:
  ██████████████
  ██  ░░░░░░  ██
  ██  ██████  ██
  ...
  ```
- **Utilisation** : Copiez la passphrase ou partagez le QR code.

### encrypt

Chiffre `.env` en `.encryptenv`.

```bash
envsync encrypt
```

- **Prompt** : Passphrase.
- **Résultat** : Crée/mise à jour `.encryptenv`.

### decrypt

Déchiffre `.encryptenv` pour recréer `.env`.

```bash
envsync decrypt
```

- **Prompt** : Passphrase.
- **Résultat** : Crée/mise à jour `.env`.

### status

Vérifie la synchronisation entre `.env` et `.encryptenv`.

```bash
envsync status
```

- **Prompt** : Passphrase.
- **Sortie** :
  - Synchronisés : `Files are synchronized.`
  - Non synchronisés : `Files are out of sync. Run 'encrypt' to update .encryptenv or 'decrypt' to update .env.`

### rotate-key

Change la passphrase de `.encryptenv`.

```bash
envsync rotate-key
```

- **Prompts** : Ancienne passphrase, nouvelle passphrase.
- **Résultat** : Met à jour `.encryptenv` avec la nouvelle passphrase.

## Partage des variables d'environnement

Le fichier `.encryptenv` est inclus dans le dépôt Git pour partager les variables chiffrées. Les développeurs utilisent la passphrase pour déchiffrer les variables.

### Étapes pour un développeur

1. **Installer** `envsync-cli` :

   ```bash
   npm install -g envsync-cli
   ```

2. **Cloner le projet** :

   ```bash
   git clone <url-du-projet>
   cd <projet>
   ```

3. **Obtenir la passphrase** :

   - **QR code** : Scanner le QR code partagé par l'équipe.
   - **Gestionnaire de secrets** : Accéder à Vault, 1Password, etc.
   - **Messagerie chiffrée** : Recevoir via Signal, Keybase, ou GPG.

4. **Déchiffrer** `.encryptenv` :

   ```bash
   npx envsync decrypt
   ```

   - Entrez la passphrase.
   - Résultat : Crée `.env`.

5. **Vérifier** :

   ```bash
   envsync status
   cat .env
   ```

### Partage de la passphrase

- **Méthodes** :
  - **QR Code** : Partagez via une réunion ou une messagerie chiffrée.
  - **Gestionnaire de secrets** : Stockez dans Vault, AWS Secrets Manager, ou 1Password.
  - **Messagerie chiffrée** : Utilisez Signal, Keybase, ou email GPG.
- **À éviter** : Ne partagez pas la passphrase dans le dépôt Git ou via des canaux non sécurisés.

### Environnements multiples

Pour différents environnements :

- Créez `.encryptenv.dev`, `.encryptenv.prod`, etc.
- Configurez `envsync.config.json` ou passez des options spécifiques (si implémenté).
- Utilisez des passphrases distinctes par environnement.

## Gestion d'une clé compromise

En cas de compromission de la passphrase :

1. **Changer la passphrase** :

   ```bash
   envsync rotate-key
   ```

   - Entrez l'ancienne et la nouvelle passphrase.
   - Mise à jour de `.encryptenv`.

2. **Mettre à jour le dépôt** :

   ```bash
   git add .encryptenv
   git commit -m "Rotate encryption key"
   git push
   ```

3. **Partager la nouvelle passphrase** :

   - Générez un nouveau QR code :

     ```bash
     envsync generate-key
     ```
   - Partagez via un canal sécurisé.

4. **Vérifier** :

   ```bash
   npx envsync decrypt
   ```

## Bonnes pratiques de sécurité

- **Dépôt privé** : Limitez l'accès au dépôt Git.
- **Passphrase sécurisée** : Utilisez `envsync generate-key` pour des passphrases robustes.
- **Rotation régulière** : Changez la passphrase tous les 3-6 mois.
- **Surveillance** : Vérifiez les accès au dépôt.
- **Gestionnaire de secrets** : Préférez Vault ou 1Password.
- **Sauvegarde** : Stockez la passphrase en lieu sûr.

## Dépannage

- **Erreur :** `File not found` : Vérifiez la présence de `.encryptenv` et `envsync.config.json`.
- **Erreur :** `Decryption failed` : Passphrase incorrecte. Contactez l'équipe.
- **Commande** `envsync` **introuvable** : Installez globalement avec `npm install -g envsync-cli`.
- **Fichiers non synchronisés** : Exécutez `envsync status` et mettez à jour avec `encrypt` ou `decrypt`.

Pour plus d'aide, ouvrez une issue sur GitHub.

## Contribuer

1. Forkez le dépôt : `https://github.com/adandeigor/envsync-cli`.
2. Créez une branche : `git checkout -b feature/<nom>`.
3. Ajoutez des tests et exécutez : `npm test`.
4. Soumettez une pull request.

Voir `CONTRIBUTING.md` pour plus de détails.

## Licence

MIT License. Voir `LICENSE` pour plus d'informations.