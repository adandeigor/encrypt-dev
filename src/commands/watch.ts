import chokidar from 'chokidar';
import { readConfig } from '../utils/config';
import { encryptCommand } from './encrypt';

export async function watchCommand(): Promise<void> {
  const config = readConfig();
  console.log(`Watching ${config.source} for changes...`);
  chokidar.watch(config.source).on('change', async () => {
    console.log(`${config.source} changed, re-encrypting...`);
    await encryptCommand();
  });
}