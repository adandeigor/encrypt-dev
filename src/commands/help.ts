export function helpCommand(): void {
    console.log(`
  envsync-cli: Secure environment file management
  
  Commands:
    init          Initialize project and create envsync.config.json
    encrypt       Encrypt .env to .encryptenv
    decrypt       Decrypt .encryptenv to .env
    status        Check if .env and .encryptenv are synchronized
    rotate-key    Re-encrypt .encryptenv with a new key
    generate-key  Generate a random key and display as QR code
    watch         Watch .env for changes and auto-encrypt
    help          Show this help message
  
  Options:
    --env <name>  Specify environment (e.g., dev, prod)
    --profile <name> Specify configuration profile
    `);
  }