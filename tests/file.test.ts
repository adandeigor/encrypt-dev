import * as fs from 'fs';
import { readFile, writeFile, checkSyncStatus } from '../src/utils/file';
import { errors } from '../src/utils/error';
import { encrypt } from '../src/utils/crypto';

jest.mock('fs');

describe('File', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
  });

  it('reads file', () => {
    (fs.readFileSync as jest.Mock).mockReturnValue('test content');
    expect(readFile('test.txt')).toBe('test content');
    expect(fs.readFileSync).toHaveBeenCalledWith('test.txt', 'utf8');
  });

  it('throws if file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    expect(() => readFile('test.txt')).toThrow(errors.FILE_NOT_FOUND('test.txt'));
  });

  it('writes file', () => {
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    writeFile('test.txt', 'test content');
    expect(fs.writeFileSync).toHaveBeenCalledWith('test.txt', 'test content', 'utf8');
  });

  it('checks sync status', () => {
    const source = 'KEY=VALUE';
    const passphrase = 'test';
    const encrypted = encrypt(source, passphrase);
    (fs.readFileSync as jest.Mock)
      .mockReturnValueOnce(source)
      .mockReturnValueOnce(JSON.stringify(encrypted));
    expect(checkSyncStatus('.env', '.encryptenv', passphrase)).toMatchObject({
      isSynced: true,
      message: 'Files are synchronized.',
    });
  });

  it('detects out of sync', () => {
    const source = 'KEY=VALUE';
    const passphrase = 'test';
    const encrypted = encrypt('DIFFERENT=VALUE', passphrase);
    (fs.readFileSync as jest.Mock)
      .mockReturnValueOnce(source)
      .mockReturnValueOnce(JSON.stringify(encrypted));
    expect(checkSyncStatus('.env', '.encryptenv', passphrase)).toMatchObject({
      isSynced: false,
      message: "Files are out of sync. Run 'encrypt' to update .encryptenv or 'decrypt' to update .env.",
    });
  });
});