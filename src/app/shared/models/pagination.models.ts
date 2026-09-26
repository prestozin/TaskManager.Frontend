export class PagedParams {
  pageNumber = 1;
  pageSize = 10;
  sort = '';
  order = 'asc';
}

export interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
