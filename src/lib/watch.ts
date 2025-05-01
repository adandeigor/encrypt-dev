import chokidar from 'chokidar';
import { loadConfig } from './config';
import { encryptProfile } from './encrypt';
import { CommandOptions, ProfileConfig } from '../types';

async function watch(options: CommandOptions): Promise<void> {
  try {
    const config = await loadConfig();
    const profile = options.profile || 'default';
    const profileConfig = config.profiles[profile];

    if (!profileConfig) {
      throw new Error(`Profil ${profile} non trouvé dans envsync.config.json`);
    }

    console.log(`Surveillance du fichier ${profileConfig.source}...`);
    chokidar.watch(profileConfig.source).on('change', async () => {
      console.log(`Modification détectée dans ${profileConfig.source}`);
      await encryptProfile(profileConfig);
    });
  } catch (error: any) {
    console.error(`Erreur lors de la surveillance : ${error.message}`);
    process.exit(1);
  }
}

export { watch };