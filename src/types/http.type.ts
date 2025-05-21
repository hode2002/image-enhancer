export type BaseResponse<T> = {
  status: string;
  statusCode: number;
  message: string;
  data: T;
};
