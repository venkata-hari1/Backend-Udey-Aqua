import * as crypto from 'crypto';
export function generateOTP(length = 4): string {
  const max = Math.pow(10, length);    
  const otp = crypto.randomInt(0, max); 
  return otp.toString().padStart(length, '0');
}

