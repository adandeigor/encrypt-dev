import QRCode from 'qrcode';
import { randomBytes } from 'crypto';
import { errors } from './error';

export async function generateKeyAndQR(): Promise<{ key: string; qr: string }> {
  try {
    const key = randomBytes(32).toString('hex');
    const qr = await QRCode.toString(key, { type: 'terminal' });
    return { key, qr };
  } catch (err) {
    throw errors.ENCRYPTION_FAILED('Failed to generate QR code');
  }
}