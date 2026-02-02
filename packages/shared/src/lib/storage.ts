import CryptoJS from 'crypto-js';

export class LocalStorage {
  static get = <T>(key: string, SECRET_KEY: string): T | null => {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) {
      return null;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedValue) as T;
    } catch (error) {
      console.error('Failed to decrypt localStorage value:', error);
      return null;
    }
  };

  static save = <T>(key: string, value: T, SECRET_KEY: string) => {
    try {
      const stringifiedValue = JSON.stringify(value);
      const encryptedValue = CryptoJS.AES.encrypt(
        stringifiedValue,
        SECRET_KEY,
      ).toString();
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Failed to encrypt and save to localStorage:', error);
    }
  };

  static delete = (key: string) => {
    localStorage.removeItem(key);
  };
}
