export declare class LocalStorage {
    static get: <T>(key: string, SECRET_KEY: string) => T | null;
    static save: <T>(key: string, value: T, SECRET_KEY: string) => void;
    static delete: (key: string) => void;
}
//# sourceMappingURL=storage.d.ts.map