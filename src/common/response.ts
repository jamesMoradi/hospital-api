export interface IPagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ApiResponse<T> {
  readonly status: number;
  readonly code: string;
  readonly message: string;
  readonly data?: T | null;
  readonly pagination?: IPagination;

  constructor(
    status: number,
    code: string,
    message: string,
    data?: T | null,
    pagination?: IPagination,
  ) {
    this.code = code;
    this.data = data;
    this.status = status;
    this.message = message;
    this.pagination = pagination;
  }

  static success<T>(
    status: number,
    code: string,
    message: string,
    data: T,
    pagination?: IPagination,
  ): ApiResponse<T> {
    return new ApiResponse(status, code, message, data, pagination);
  }

  static error<T = null>(
    status: number,
    code: string,
    message: string,
  ): ApiResponse<T> {
    return new ApiResponse(status, code, message);
  }
}

export type IApiResponse<T> = Promise<ApiResponse<T>>;
