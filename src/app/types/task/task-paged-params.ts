import { ETaskStatus } from "../../enums/ETaskStatus";

export class TaskPagedParams {
  pageNumber = 1;
  pageSize = 10;
  sort = 'CreatedAt';
  order = 'desc';
  taskStatusId: ETaskStatus | null = null;
}