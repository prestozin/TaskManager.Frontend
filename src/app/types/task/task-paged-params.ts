import { PagedParams } from "../paged-params";

export class TaskPagedParams extends PagedParams {
  taskStatusId: number | null = null;
  taskPriorityId: number | null = null;
}