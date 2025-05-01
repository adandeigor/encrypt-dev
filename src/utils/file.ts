import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { errors } from './error';
import { decrypt } from './crypto';

export function readFile(path: string): string {
  if (!existsSync(path)) {
    throw errors.FILE_NOT_FOUND(path);
  }
  return readFileSync(path, 'utf8');
}

export function writeFile(path: string, data: string): void {
  try {
    writeFileSync(path, data, 'utf8');
  } catch (err) {
    throw errors.ENCRYPTION_FAILED(`Failed to write file: ${path}`);
  }
}

export function readEncryptedFile(path: string): { data: any; raw: string } {
  const raw = readFile(path);
  try {
    return { data: JSON.parse(raw), raw };
  } catch (err) {
    throw errors.DECRYPTION_FAILED('Invalid encrypted file format');
  }
}

export function checkSyncStatus(
  sourcePath: string,
  encryptedPath: string,
  passphrase: string
): { isSynced: boolean; message: string } {
  if (!existsSync(sourcePath)) {
    return { isSynced: false, message: `Source file (${sourcePath}) not found. Run 'encrypt' to create it.` };
  }
  if (!existsSync(encryptedPath)) {
    return { isSynced: false, message: `Encrypted file (${encryptedPath}) not found. Run 'encrypt' to sync.` };
  }

  try {
    const sourceContent = readFile(sourcePath);
    const encrypted = readEncryptedFile(encryptedPath);
    const decrypted = decrypt(encrypted.data, passphrase);

    if (sourceContent === decrypted) {
      return { isSynced: true, message: 'Files are synchronized.' };
    } else {
      return {
        isSynced: false,
        message: `Files are out of sync. Run 'encrypt' to update ${encryptedPath} or 'decrypt' to update ${sourcePath}.`,
      };
    }
  } catch (err) {
    return {
      isSynced: false,
      message: `Error checking sync status: ${err instanceof Error ? err.message : 'Unknown error'}.`,
    };
  }
}