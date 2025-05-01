envsync-cli
Outil CLI pour synchroniser et sécuriser les fichiers .env dans un dépôt Git, écrit en TypeScript.
Installation
npm install -g envsync-cli

Commandes

init : Configure le projet via un assistant interactif.
encrypt : Chiffre un fichier en .encryptenv.
decrypt : Déchiffre un fichier .encryptenv.
status : Vérifie la synchronisation.
rotate-key : Rechiffre avec une nouvelle clé.
generate-key : Génère une clé aléatoire avec QR code.
watch : Surveille les modifications.
help : Affiche l’aide.

Exemple
npx envsync-cli init
npx envsync-cli encrypt
npx envsync-cli decrypt

Sécurité

Chiffrement AES-256-CBC avec IV aléatoire.
Dérivation de clé via PBKDF2.
Hash SHA256 pour l’intégrité.
Typage strict avec TypeScript.

Développement
npm install
npm run build
npm test

Licence
MIT
