import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { FeedbackService } from '@core/services/feedback/feedback.service';

import { TASK_MESSAGES } from '@shared/constants/messages';
import { PagedResponse } from '@shared/models/pagination.models';
import { ResultResponse } from '@shared/models/response.models';
import { SelectableOption } from '@shared/models/selectables.models';

import { TaskCreateRequest, TaskEditRequest, TaskPagedParams, TaskResponse } from '../models/task.models';

import { TaskService } from '../services/task.service';


@Injectable({
    providedIn: 'root'
})

export class TaskFacade {

    // =========================
    // Dependencies
    // =========================

    private readonly taskService = inject(TaskService);
    private readonly feedbackService = inject(FeedbackService);


    // =========================
    // Query state
    // =========================

    private readonly pagedParams = new TaskPagedParams();


    // =========================
    // Internal state
    // =========================

    private readonly _tasks = signal<TaskResponse[]>([]);

    private readonly _pagedResponse = signal<PagedResponse<TaskResponse> | null>(null);

    private readonly _selectedTask = signal<TaskResponse | null>(null);

    private readonly _statusOptions = signal<SelectableOption[]>([]);

    private readonly _priorityOptions = signal<SelectableOption[]>([]);

    private readonly _selectedStatus =
        signal<SelectableOption>({
            id: null,
            name: 'Todos os status'
        });

    private readonly _selectedPriority =
        signal<SelectableOption>({
            id: null,
            name: 'Todas as prioridades'
        });

    private readonly _errorMessage = signal<string | null>(null);


    // =========================
    // Public state
    // =========================

    readonly tasks = this._tasks.asReadonly();

    readonly pagedResponse = this._pagedResponse.asReadonly();

    readonly selectedTask = this._selectedTask.asReadonly();

    readonly statusOptions = this._statusOptions.asReadonly();

    readonly priorityOptions = this._priorityOptions.asReadonly();

    readonly selectedStatus = this._selectedStatus.asReadonly();

    readonly selectedPriority = this._selectedPriority.asReadonly();

    readonly errorMessage = this._errorMessage.asReadonly();


    // =========================
    // Derived state
    // =========================

    readonly currentPage = computed(() => this._pagedResponse()?.pageNumber ?? 1);


    // =========================
    // Queries
    // =========================

    getTasks(): void {
        this.taskService.getPaged(this.pagedParams).subscribe({
            next: response => {
                this._pagedResponse.set(response.data);
                this._tasks.set(response.data.items);
            },

            error: (error: HttpErrorResponse) => {
                this.handleError(error);

                this._tasks.set([]);
                this._pagedResponse.set(null);
            }
        });
    }

    getTaskById(taskId: string): void {
        this._selectedTask.set(null);

        this.taskService.getTaskById(taskId).subscribe({
            next: response => {
                if (response.isSuccess) {
                    this._selectedTask.set(response.data);
                }
            },

            error: (error: HttpErrorResponse) => {
                this.handleError(error);

                this.feedbackService.showMessage( error.message, '','error');
            }
        });
    }

    loadSelectables(): void {
        this.taskService.getSelectables().subscribe({
                next: response => {
                    this._statusOptions.set(response.data.status);

                    this._priorityOptions.set(response.data.priority);
                },

                error: (error: HttpErrorResponse) => {
                    this.handleError(error);
                }
            });
    }


    // =========================
    // Mutations
    // =========================

    addTask(request: TaskCreateRequest): void {
        this.taskService.addTask(request).subscribe({
                next: response => {
                    this.getTasks();

                    this.feedbackService.showMessage(response.message,TASK_MESSAGES.CREATED_SUCCESSFULLY,'success');
                },

                error: (error: HttpErrorResponse) => {
                    this.handleError(error);

                    this.feedbackService.showMessage(error.message,TASK_MESSAGES.CREATED_FAILED,'error');
                }
            });
    }

    editTask(request: TaskEditRequest): void {
        this.taskService.editTask(request).subscribe({
                next: response => {
                    this.getTasks();

                    this.feedbackService.showMessage(response.message,TASK_MESSAGES.EDITED_SUCCESSFULLY,'success');
                },

                error: (error: HttpErrorResponse) => {
                    this.handleError(error);

                    this.feedbackService.showMessage(error.message,TASK_MESSAGES.EDITED_FAILED,'error');
                }
            });
    }

    deleteTask(taskId: string): void {
        this.taskService.deleteTask(taskId).subscribe({
                next: response => {
                    this.getTasks();

                    this.feedbackService.showMessage(
                        response.message,
                        TASK_MESSAGES.DELETED_SUCCESSFULLY,
                        'success'
                    );
                },

                error: (error: HttpErrorResponse) => {
                    this.handleError(error);

                    this.feedbackService.showMessage(error.message, TASK_MESSAGES.DELETED_FAILED, 'error');
                }
            });
    }


    // =========================
    // Search / filters / sorting
    // =========================

    searchTasks(search: string): void {
        this.pagedParams.search = search.trim() || null;

        this.resetPage();
        this.getTasks();
    }

    selectStatus(status: SelectableOption): void {
        this._selectedStatus.set(status);
        this.pagedParams.taskStatusId = status.id;

        this.applyFilters();
    }

    selectPriority(priority: SelectableOption): void {
        this._selectedPriority.set(priority);
        this.pagedParams.taskPriorityId = priority.id;

        this.applyFilters();
    }

    orderTasks(sort: string): void {
        this.pagedParams.order = this.pagedParams.order === 'asc' ? 'desc' : 'asc';

        this.pagedParams.sort = sort;

        this.getTasks();
    }


    // =========================
    // Pagination
    // =========================

    changePage(page: number): void {
        this.pagedParams.pageNumber = page;
        this.getTasks();
    }


    // =========================
    // State actions
    // =========================

    clearSelectedTask(): void {
        this._selectedTask.set(null);
    }


    // =========================
    // Private helpers
    // =========================

    private applyFilters(): void {
        this.resetPage();
        this.getTasks();
    }

    private resetPage(): void {
        this.pagedParams.pageNumber = 1;
    }

    private handleError( error: HttpErrorResponse): void {
        const response = error.error as ResultResponse<null>;

        this._errorMessage.set( response?.message ?? 'Ocorreu um erro inesperado.');
    }
}