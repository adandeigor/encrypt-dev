import { init } from '../src/commands/init';
import { encryptCommand } from '../src/commands/encrypt';
import { decryptCommand } from '../src/commands/decrypt';
import { statusCommand } from '../src/commands/status';
import { rotateKeyCommand } from '../src/commands/rotate-key';
import { generateKeyCommand } from '../src/commands/generate-key';
import * as fs from 'fs';
import inquirer from 'inquirer';
import { writeConfig } from '../src/utils/config';
import { Config } from '../src/types';
import { encrypt } from '../src/utils/crypto';

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));
jest.mock('fs');

describe('Commands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.spyOn(console, 'log').mockRestore();
  });

  it('init creates config file', async () => {
    const config = {
      source: '.env',
      encrypted: '.encryptenv',
      encryption: 'aes-256-cbc',
      key_hint: 'test',
    };
    (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(config);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    await init();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'envsync.config.json',
      JSON.stringify(config, null, 2),
      'utf8'
    );
  });

  it('encrypt encrypts file', async () => {
    const config: Config = { source: '.env', encrypted: '.encryptenv', encryption: 'aes-256-cbc' };
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify(config));
    writeConfig(config);
    (fs.writeFileSync as jest.Mock).mockClear(); // Réinitialiser après writeConfig
    (inquirer.prompt as unknown as jest.Mock).mockResolvedValue({ passphrase: 'test' });
    (fs.readFileSync as jest.Mock).mockReturnValueOnce('KEY=VALUE');
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    await encryptCommand();
    expect(fs.writeFileSync).toHaveBeenLastCalledWith(
      '.encryptenv',
      expect.stringMatching(/"content":\s*".*"/),
      'utf8'
    );
  });

  it('decrypt decrypts file', async () => {
    const config: Config = { source: '.env', encrypted: '.encryptenv', encryption: 'aes-256-cbc' };
    const data = 'KEY=VALUE';
    const passphrase = 'test';
    const encrypted = encrypt(data, passphrase);
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify(config));
    writeConfig(config);
    (fs.writeFileSync as jest.Mock).mockClear(); // Réinitialiser après writeConfig
    (inquirer.prompt as unknown as jest.Mock).mockResolvedValue({ passphrase });
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify(encrypted));
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    await decryptCommand();
    expect(fs.writeFileSync).toHaveBeenLastCalledWith('.env', data, 'utf8');
  });

  it('status checks sync', async () => {
    const config: Config = { source: '.env', encrypted: '.encryptenv', encryption: 'aes-256-cbc' };
    const data = 'KEY=VALUE';
    const passphrase = 'test';
    const encrypted = encrypt(data, passphrase);
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify(config));
    writeConfig(config);
    (inquirer.prompt as unknown as jest.Mock).mockResolvedValue({ passphrase });
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock)
      .mockReturnValueOnce(data)
      .mockReturnValueOnce(JSON.stringify(encrypted));

    await statusCommand();
    expect(console.log).toHaveBeenCalled();
  });

  it('rotate-key re-encrypts file', async () => {
    const config: Config = { source: '.env', encrypted: '.encryptenv', encryption: 'aes-256-cbc' };
    const data = 'KEY=VALUE';
    const oldPassphrase = 'old';
    const newPassphrase = 'new';
    const encrypted = encrypt(data, oldPassphrase);
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify(config));
    writeConfig(config);
    (fs.writeFileSync as jest.Mock).mockClear(); // Réinitialiser après writeConfig
    (inquirer.prompt as unknown as jest.Mock).mockResolvedValue({
      oldPassphrase,
      newPassphrase,
    });
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify(encrypted));
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    await rotateKeyCommand();
    expect(fs.writeFileSync).toHaveBeenLastCalledWith(
      '.encryptenv',
      expect.stringMatching(/"content":\s*".*"/),
      'utf8'
    );
  });

  it('generate-key creates key and QR', async () => {
    await generateKeyCommand();
    expect(console.log).toHaveBeenCalledWith('Generated Key:', expect.any(String));
    expect(console.log).toHaveBeenCalledWith('QR Code:');
  });
});