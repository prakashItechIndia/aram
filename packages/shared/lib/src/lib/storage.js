import CryptoJS from 'crypto-js';
export class LocalStorage {
}
Object.defineProperty(LocalStorage, "get", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (key, SECRET_KEY) => {
        const encryptedValue = localStorage.getItem(key);
        if (!encryptedValue) {
            return null;
        }
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
            const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedValue);
        }
        catch (error) {
            console.error('Failed to decrypt localStorage value:', error);
            return null;
        }
    }
});
Object.defineProperty(LocalStorage, "save", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (key, value, SECRET_KEY) => {
        try {
            const stringifiedValue = JSON.stringify(value);
            const encryptedValue = CryptoJS.AES.encrypt(stringifiedValue, SECRET_KEY).toString();
            localStorage.setItem(key, encryptedValue);
        }
        catch (error) {
            console.error('Failed to encrypt and save to localStorage:', error);
        }
    }
});
Object.defineProperty(LocalStorage, "delete", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (key) => {
        localStorage.removeItem(key);
    }
});
