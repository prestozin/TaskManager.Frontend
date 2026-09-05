import { PagedParams } from "../../../shared/models/pagination.models";
import { SelectableResponse } from "../../../shared/models/selectables.models";

export interface TaskResponse {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
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

export class TaskPagedParams extends PagedParams {
    taskStatusId: number | null = null;
    taskPriorityId: number | null = null;
}

