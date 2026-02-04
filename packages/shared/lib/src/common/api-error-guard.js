import { AxiosError } from 'axios';
import { err, ok } from 'neverthrow';
export class ApiError {
    constructor({ message, type, status, errors, }) {
        Object.defineProperty(this, "message", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "errors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.message = message;
        this.status = status;
        this.type = type;
        this.errors = errors;
    }
}
export const guardApi = async (resPromise) => {
    try {
        const res = await resPromise;
        return ok(res.data);
    }
    catch (e) {
        if (e instanceof AxiosError) {
            return err(new ApiError({
                errors: e.response?.data?.errors ?? [],
                message: e.response?.data?.message ?? e.message,
                status: e.response?.status ?? e.status,
                type: e.response?.data?.type ?? e.code,
            }));
        }
        return err(new ApiError({
            message: 'Something went wrong! Please try again',
            type: 'Unknown',
        }));
    }
};
