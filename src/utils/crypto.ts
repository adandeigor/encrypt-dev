import crypto from 'crypto';

async function encryptFile(content: string, passphrase: string): Promise<string> {
  const iv = crypto.randomBytes(16);
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(content, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const hash = crypto.createHash('sha256').update(encrypted, 'utf8').digest('hex');
  return Buffer.concat([
    iv,
    salt,
    Buffer.from(hash, 'hex'),
    Buffer.from(encrypted, 'hex')
  ]).toString('base64');
}

async function decryptFile(encrypted: string, passphrase: string): Promise<string> {
  const buffer = Buffer.from(encrypted, 'base64');
  const iv = buffer.slice(0, 16);
  const salt = buffer.slice(16, 32);
  const hash = buffer.slice(32, 64).toString('hex'); // SHA256 hash = 32 bytes
  const data = buffer.slice(64).toString('hex');
  const computedHash = crypto.createHash('sha256').update(data, 'utf8').digest('hex');
  if (hash !== computedHash) {
    throw new Error('Intégrité du fichier compromise.');
  }
  const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  try {
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Intégrité du fichier compromise.');
  }
}

function generateRandomKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

export { encryptFile, decryptFile, generateRandomKey };