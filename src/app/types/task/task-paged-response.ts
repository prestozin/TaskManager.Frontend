import { TaskResponse } from "./task-response";

export type TaskPagedResponse = {
    items: TaskResponse[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}