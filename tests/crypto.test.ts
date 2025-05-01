import { encrypt, decrypt } from '../src/utils/crypto';
import { errors } from '../src/utils/error';

describe('Crypto', () => {
  it('encrypts and decrypts correctly', () => {
    const data = 'KEY=VALUE';
    const passphrase = 'test';
    const encrypted = encrypt(data, passphrase);
    const decrypted = decrypt(encrypted, passphrase);
    expect(decrypted).toBe(data);
  });

  it('throws on invalid passphrase', () => {
    const data = 'KEY=VALUE';
    const passphrase = 'test';
    const encrypted = encrypt(data, passphrase);
    expect(() => decrypt(encrypted, 'wrong')).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('Decryption failed'),
        code: 'DECRYPTION_FAILED',
      })
    );
  });

  it('throws on tampered data', () => {
    const data = 'KEY=VALUE';
    const passphrase = 'test';
    const encrypted = encrypt(data, passphrase);
    encrypted.hash = 'tampered';
    expect(() => decrypt(encrypted, passphrase)).toThrow(errors.INTEGRITY_CHECK_FAILED());
  });
});