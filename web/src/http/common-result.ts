export interface CommonResult<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    data: T;
}

export interface EmptyCommonResult {
    isSuccess: boolean;
    code: string;
    message: string;
}