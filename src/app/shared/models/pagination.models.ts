export class PagedParams {
  pageNumber: number = 1;
  pageSize: number = 10;
  sort: string = 'CreatedAt';
  order: string = 'asc';
}

export interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}