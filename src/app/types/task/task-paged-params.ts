import { ETaskStatus } from "../../enums/ETaskStatus";
import { PagedParams } from "../paged-params";

export class TaskPagedParams extends PagedParams {
  taskStatusId: ETaskStatus | null = null;
}