import { TaskPriorityResponse } from "../types/task/task-priority-response";
import { TaskStatusResponse } from "./task-status-response";


export interface TaskSelectablesResponse {
    status: TaskStatusResponse[];
    priority: TaskPriorityResponse[];
}