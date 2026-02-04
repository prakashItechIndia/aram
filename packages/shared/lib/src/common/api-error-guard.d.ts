import { AxiosResponse } from 'axios';
import { Result } from 'neverthrow';
export declare class ApiError {
    message: string;
    type: string;
    status?: number;
    errors?: {
        type: string;
        message: string;
    }[];
    constructor({ message, type, status, errors, }: {
        message: string;
        type: string;
        status?: number;
        errors?: {
            type: string;
            message: string;
        }[];
    });
}
export declare const guardApi: <T, K = unknown>(resPromise: Promise<AxiosResponse<T, K>>) => Promise<Result<T, ApiError>>;
//# sourceMappingURL=api-error-guard.d.ts.map