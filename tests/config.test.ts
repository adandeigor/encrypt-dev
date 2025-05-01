import { readConfig, writeConfig, CONFIG_FILE } from '../src/utils/config';
import * as fs from 'fs';
import { Config } from '../src/types';
import { errors } from '../src/utils/error';

jest.mock('fs');

describe('Config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
  });

  it('writes and reads config', () => {
    const config: Config = {
      source: '.env',
      encrypted: '.encryptenv',
      encryption: 'aes-256-cbc',
    };
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(config));

    writeConfig(config);
    const result = readConfig();
    expect(result).toEqual(config);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      CONFIG_FILE,
      JSON.stringify(config, null, 2),
      'utf8'
    );
  });

  it('throws on invalid config', () => {
    (fs.readFileSync as jest.Mock).mockReturnValue('{}');
    expect(() => readConfig()).toThrow(errors.INVALID_CONFIG('Missing required fields'));
  });
});