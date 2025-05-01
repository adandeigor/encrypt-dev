import { createCipheriv, createDecipheriv, randomBytes, createHash, pbkdf2Sync } from 'crypto';
import { errors } from './error';
import { EnvsyncError } from '../types';

export interface EncryptedData {
  iv: string;
  salt: string;
  hash: string;
  content: string;
}

export function encrypt(data: string, passphrase: string): EncryptedData {
  try {
    const salt = randomBytes(16);
    const key = pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const hash = createHash('sha256').update(data).digest('hex');

    return {
      iv: iv.toString('hex'),
      salt: salt.toString('hex'),
      hash,
      content: encrypted,
    };
  } catch (err) {
    throw errors.ENCRYPTION_FAILED(err instanceof Error ? err.message || 'Encryption error' : 'Unknown error');
  }
}

export function decrypt(data: EncryptedData, passphrase: string): string {
  try {
    const salt = Buffer.from(data.salt, 'hex');
    const key = pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
    const iv = Buffer.from(data.iv, 'hex');
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const hash = createHash('sha256').update(decrypted).digest('hex');
    if (hash !== data.hash) {
      throw errors.INTEGRITY_CHECK_FAILED();
    }

    return decrypted;
  } catch (err) {
    if (err instanceof EnvsyncError) {
      throw err;
    }
    const errorMessage = err instanceof Error ? err.message || 'Bad decrypt' : 'Unknown error';
    throw errors.DECRYPTION_FAILED(errorMessage);
  }
}