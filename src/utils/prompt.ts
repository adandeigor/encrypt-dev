import inquirer from 'inquirer';
import { promises as fs } from 'fs';
import path from 'path';

async function selectFile(): Promise<string> {
  const files = await fs.readdir(process.cwd());
  const { file } = await inquirer.prompt<{ file: string }>([
    {
      type: 'list',
      name: 'file',
      message: 'Sélectionnez un fichier :',
      choices: files.filter((f) => !f.startsWith('.encryptenv') && !f.includes('envsync'))
    }
  ]);
  return path.join(process.cwd(), file);
}

export { selectFile };