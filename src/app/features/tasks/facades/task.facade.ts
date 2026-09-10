import { HttpErrorResponse } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { PagedResponse } from "@shared/models/pagination.models";
import { ResultResponse } from "@shared/models/response.models";
import { SelectableOption } from "@shared/models/selectables.models";
import { TaskResponse, TaskPagedParams, TaskCreateRequest, TaskEditRequest } from "../models/task.models";
import { TaskService } from "../services/task.service";
import { FeedbackService } from "@core/services/feedback/feedback.service";
import { TASK_MESSAGES } from "@shared/constants/messages";


@Injectable({
    providedIn: 'root'
})

export class TaskFacade {

    private taskService = inject(TaskService);
    private feedbackService = inject(FeedbackService)

    pagedParams = new TaskPagedParams();

    tasks = signal<TaskResponse[]>([]);
    pagedResponse = signal<PagedResponse<TaskResponse> | null>(null);

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

    addTask(request: TaskCreateRequest): void {
        this.taskService.addTask(request).subscribe({
            next: (response) => {
                this.getTasks();
                this.feedbackService.showMessage(response.message, TASK_MESSAGES.CREATED_SUCCESSFULLY, 'success')
            },
            error: (error: HttpErrorResponse) => {
                this.handleError(error);
                this.feedbackService.showMessage(error.message, TASK_MESSAGES.CREATED_FAILED, 'error')
            }
        });
    }

    editTask(request: TaskEditRequest): void {
        this.taskService.editTask(request).subscribe({
            next: (response) => {
                this.getTasks();
                this.feedbackService.showMessage(response.message, TASK_MESSAGES.EDITED_SUCCESSFULLY, 'success')
            },
            error: (error: HttpErrorResponse) => {
                this.handleError(error);
                this.feedbackService.showMessage(error.message, TASK_MESSAGES.EDITED_FAILED, 'error')
            }
        })
    }

    deleteTask(taskId: string): void {
        this.taskService.deleteTask(taskId).subscribe({
            next: (response) => {
                this.getTasks();
                this.feedbackService.showMessage(response.message, TASK_MESSAGES.DELETED_SUCCESSFULLY, 'success')
            },
            error: (error: HttpErrorResponse) => {
                this.handleError(error);
                this.feedbackService.showMessage(error.message, TASK_MESSAGES.DELETED_FAILED, 'error')
            }
        })
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

    searchTasks(search: string): void {
        this.pagedParams.search = search.trim() || null;
        this.pagedParams.pageNumber = 1;

        this.getTasks();
    }
    loadSelectables(): void {
        this.taskService.getSelectables().subscribe({
            next: (response) => {
                this.statusOptions.set(response.data.status);
                this.priorityOptions.set(response.data.priority);
            },

            error: (error: HttpErrorResponse) => {
                this.handleError(error);
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
