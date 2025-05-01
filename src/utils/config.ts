import { readFile, writeFile } from './file';
import { Config, EnvsyncError } from '../types';
import { errors } from './error';

export const CONFIG_FILE = 'envsync.config.json';

export function readConfig(): Config {
  try {
    const data = readFile(CONFIG_FILE);
    const config = JSON.parse(data);
    if (!config.source || !config.encrypted || !config.encryption) {
      throw errors.INVALID_CONFIG('Missing required fields');
    }
    return config;
  } catch (err) {
    if (err instanceof EnvsyncError) {
      throw err;
    }
    throw errors.INVALID_CONFIG(err instanceof Error ? err.message : 'Unknown error');
  }
}

export function writeConfig(config: Config): void {
  writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}