import { encryptFile, decryptFile } from '../src/utils/crypto';

describe('Crypto', () => {
  it('should encrypt and decrypt correctly', async () => {
    const content = 'TEST=123';
    const key = 'ma-cle-secrete';
    const encrypted = await encryptFile(content, key);
    const decrypted = await decryptFile(encrypted, key);
    expect(decrypted).toBe(content);
  });

  it('should throw error with wrong key', async () => {
    const content = 'TEST=123';
    const key = 'ma-cle-secrete';
    const wrongKey = 'mauvaise-cle';
    const encrypted = await encryptFile(content, key);
    await expect(decryptFile(encrypted, wrongKey)).rejects.toThrow('Intégrité du fichier compromise.');
  });
});