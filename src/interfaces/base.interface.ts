export interface BaseResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface ErrorBaseResponse {
    success: boolean;
    message: string;
    error: unknown;
    errors: unknown;
}