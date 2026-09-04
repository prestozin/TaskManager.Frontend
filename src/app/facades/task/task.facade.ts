import { computed, inject, Injectable, signal } from "@angular/core";
import { TaskService } from "../../services/task/task.service";
import { TaskResponse } from "../../types/task/task-response";
import { SelectableOption } from "../../interfaces/task/selectable-option";
import { TaskPagedParams } from "../../types/task/task-paged-params";
import { PagedResponse } from "../../types/task/paged-response";
import { HttpErrorResponse } from "@angular/common/http";
import { ResultResponse } from "../../types/result/result-response";

@Injectable({
    providedIn: 'root'
})

export class TaskFacade {

    private taskService = inject(TaskService);

    pagedParams = new TaskPagedParams();

    tasks = signal<TaskResponse[]>([]);
    pagedResponse = signal<PagedResponse | null>(null);

    currentPage = computed(
        () => this.pagedResponse()?.pageNumber ?? 1
    );

    statusOptions = signal<SelectableOption[]>([]);
    priorityOptions = signal<SelectableOption[]>([]);

    errorMessage = signal<string | null>(null);

    selectedStatus = signal<SelectableOption>({
        id: null,
        name: 'Todos os status'
    });

    selectedPriority = signal<SelectableOption>({
        id: null,
        name: 'Todas as prioridades'
    });

    private handleError(error: HttpErrorResponse): void {
        const response = error.error as ResultResponse<null>;

        this.errorMessage.set(
            response?.message ?? 'Ocorreu um erro inesperado.'
        );
    }

    getTasks(): void {
        this.taskService.getPaged(this.pagedParams).subscribe({
            next: (response) => {
                this.pagedResponse.set(response.data);
                this.tasks.set(response.data.items);
            },
            error: (error: HttpErrorResponse) => {
                this.handleError(error);

                this.tasks.set([]);
                this.pagedResponse.set(null);
            }
        });
    };

    loadSelectables(): void {
        this.taskService.getSelectables().subscribe({
            next: (response) => {
                this.statusOptions.set([
                    {
                        id: null,
                        name: 'Todos os status'
                    },
                    ...response.data.status
                ]);

                this.priorityOptions.set([
                    {
                        id: null,
                        name: 'Todas as prioridades'
                    },
                    ...response.data.priority
                ]);
            },

            error: (error: HttpErrorResponse) => {
                this.handleError(error);

                this.tasks.set([]);
                this.pagedResponse.set(null);
            }
        });
    }

    selectStatus(status: SelectableOption): void {
        this.selectedStatus.set(status);
        this.pagedParams.taskStatusId = status.id;
        this.applyFilters();
    }

    selectPriority(priority: SelectableOption): void {
        this.selectedPriority.set(priority);
        this.pagedParams.taskPriorityId = priority.id;
        this.applyFilters();
    }

    changePage(page: number): void {
        this.pagedParams.pageNumber = page;
        this.getTasks();
    }

    orderTasks(sort: string): void {
        this.pagedParams.order = this.pagedParams.order === 'asc' ? 'desc' : 'asc';
        this.pagedParams.sort = sort;
        this.getTasks();
    }

    private applyFilters(): void {
        this.pagedParams.pageNumber = 1;
        this.getTasks();
    }
}
