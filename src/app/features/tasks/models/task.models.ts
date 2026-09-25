import { PagedParams } from "../../../shared/models/pagination.models";
import { SelectableResponse } from "../../../shared/models/selectables.models";
import { ETaskSort } from "../enums/task.enum";

export interface TaskResponse {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    status: string;
    priority: string;
}

export interface TaskCreateRequest {
    title: string;
    description: string;
    statusId: number;
    priorityId: number;
}

export interface TaskEditRequest {
    id: string;
    title: string;
    description: string;
    statusId: number;
    priorityId: number;
}

export interface TaskSelectablesResponse {
    status: SelectableResponse[];
    priority: SelectableResponse[];
}

export interface DeleteTaskRequest {
    taskId: string[];
}

export class TaskPagedParams extends PagedParams {
    override sort: string = ETaskSort.CreatedAt;
    override order: string = 'desc';
    taskStatusId: number | null = null;
    taskPriorityId: number | null = null;
    search: string | null = null;
    startDate: string | null = null;
    endDate: string | null = null;
}

export class TaskReportParams {
    startDate: string | null = null;
    endDate: string | null = null;
    pageNumber: number = 1;
    pageSize: number = 4;
}

export interface TaskReportItemResponse {
    id: number;
    name: string;
    count: number;
    percentage: number;
}

export interface TaskReportResponse {
    totalTasks: number;
    status: TaskReportItemResponse[];
    priority: TaskReportItemResponse[];
    tasks: TaskResponse[];
}
