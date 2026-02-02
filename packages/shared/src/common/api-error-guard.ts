import { AxiosError, AxiosResponse } from 'axios';
import { err, ok, Result } from 'neverthrow';

export class ApiError {
  message: string;
  type: string;
  status?: number;
  errors?: {
    type: string;
    message: string;
  }[];

  constructor({
    message,
    type,
    status,
    errors,
  }: {
    message: string;
    type: string;
    status?: number;
    errors?: {
      type: string;
      message: string;
    }[];
  }) {
    this.message = message;
    this.status = status;
    this.type = type;
    this.errors = errors;
  }
}

export const guardApi = async <T, K = unknown>(
  resPromise: Promise<AxiosResponse<T, K>>,
): Promise<Result<T, ApiError>> => {
  try {
    const res = await resPromise;
    return ok(res.data);
  } catch (e) {
    if (e instanceof AxiosError) {
      return err(
        new ApiError({
          errors: e.response?.data?.errors ?? [],
          message: e.response?.data?.message ?? e.message,
          status: e.response?.status ?? e.status,
          type: e.response?.data?.type ?? e.code,
        }),
      );
    }
    return err(
      new ApiError({
        message: 'Something went wrong! Please try again',
        type: 'Unknown',
      }),
    );
  }
};
