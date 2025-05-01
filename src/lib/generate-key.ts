import { generateRandomKey } from '../utils/crypto';
import QRCode from 'qrcode';

async function generateKey(): Promise<void> {
  try {
    const key = generateRandomKey();
    console.log(`Clé générée : ${key}`);
    console.log('QR Code :');
    await QRCode.toString(key, { type: 'terminal' });
  } catch (error: any) {
    console.error(`Erreur lors de la génération de la clé : ${error.message}`);
    process.exit(1);
  }
}

export { generateKey };