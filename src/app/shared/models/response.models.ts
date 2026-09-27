export interface ResultResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T | null;
  errors?: string[] | null;
}