export interface ResultResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}