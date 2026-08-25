import { TaskResponse } from "./task-response";

export type PagedResponse = {
    items: TaskResponse[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}