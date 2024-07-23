import { Injectable } from '@nestjs/common';
import { AES, enc } from 'crypto-js';

@Injectable()
export class EncryptService {
  generateHash = (password: string): string => {
    const hash = AES.encrypt(password, process.env.SECRET_KEY);

    return hash.toString();
  };

  decryptHash = (hash: string): string => {
    const decrypted = AES.decrypt(hash, process.env.SECRET_KEY);

    return decrypted.toString(enc.Utf8);
  };
}
