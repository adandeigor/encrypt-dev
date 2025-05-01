import { generateKeyAndQR } from '../utils/qrcode';

export async function generateKeyCommand(): Promise<void> {
  const { key, qr } = await generateKeyAndQR();
  console.log('Generated Key:', key);
  console.log('QR Code:');
  console.log(qr);
}