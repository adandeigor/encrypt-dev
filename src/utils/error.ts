import { EnvsyncError } from '../types';

export const errors = {
  FILE_NOT_FOUND: (path: string) => new EnvsyncError(`File not found: ${path}`, 'FILE_NOT_FOUND'),
  INVALID_CONFIG: (reason: string) => new EnvsyncError(`Invalid configuration: ${reason}`, 'INVALID_CONFIG'),
  ENCRYPTION_FAILED: (reason: string) => new EnvsyncError(`Encryption failed: ${reason}`, 'ENCRYPTION_FAILED'),
  DECRYPTION_FAILED: (reason: string) => new EnvsyncError(`Decryption failed: ${reason}`, 'DECRYPTION_FAILED'),
  INTEGRITY_CHECK_FAILED: () => new EnvsyncError('File integrity check failed', 'INTEGRITY_CHECK_FAILED'),
  SYNC_MISMATCH: (details: string) => new EnvsyncError(`Files out of sync: ${details}`, 'SYNC_MISMATCH'),
};