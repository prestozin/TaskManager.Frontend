import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { FeedbackService } from '@core/services/feedback/feedback.service';

import { TASK_MESSAGES } from '@shared/constants/messages';
import { ResultResponse } from '@shared/models/response.models';
import { SelectableOption } from '@shared/models/selectables.models';

import { TaskCreateRequest, TaskEditRequest } from '../models/task.models';

import { TaskService } from '../services/task.service';
import { TaskDataState } from '../states/task-data.state';
import { EFeedbackType } from '@shared/enums/feedback.enum';


@Injectable({
    providedIn: 'root'
})

export class TaskFacade {

    // =========================
    // Dependencies
    // =========================

    private readonly taskService = inject(TaskService);
    private readonly taskDataState = inject(TaskDataState);
    private readonly feedbackService = inject(FeedbackService);


    // =========================
    // State
    // =========================

    get tasks() {
        return this.taskDataState.tasks;
    }

    get pagedResponse() {
        return this.taskDataState.pagedResponse;
    }

    get selectedTask() {
        return this.taskDataState.selectedTask;
    }

    get statusOptions() {
        return this.taskDataState.statusOptions;
    }

    get priorityOptions() {
        return this.taskDataState.priorityOptions;
    }

    get selectedStatus() {
        return this.taskDataState.selectedStatus;
    }

    get selectedPriority() {
        return this.taskDataState.selectedPriority;
    }

    get currentPage() {
        return this.taskDataState.currentPage;
    }

    get errorMessage() {
        return this.taskDataState.errorMessage;
    }



    // =========================
    // Data loading
    // =========================

    getTasks(): void {
        this.taskService.getPaged(this.taskDataState.pagedParams).subscribe({
            next: response => {
                this.taskDataState.setTasks(response.data);
            },

            error: (error: HttpErrorResponse) => {
                this.handleError(error);
                this.taskDataState.clearTasks();
            }
        });
    }

    getTaskById(taskId: string): void {
        this.taskDataState.clearSelectedTask();

        this.taskService.getTaskById(taskId).subscribe({
            next: response => {
                if (response.isSuccess) {
                    this.taskDataState.setSelectedTask(response.data);
                }
            },

            error: (error: HttpErrorResponse) => {
                this.handleError(error);

                this.feedbackService.showMessage(error.message, '', EFeedbackType.Error);
            }
        });
    }

    loadSelectables(): void {
        this.taskService.getSelectables().subscribe({
            next: response => {
                this.taskDataState.setStatusOptions(response.data.status);
                this.taskDataState.setPriorityOptions(response.data.priority);
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

                this.feedbackService.showMessage(response.message, TASK_MESSAGES.CREATED_SUCCESSFULLY, EFeedbackType.Success);
            },

            error: (error: HttpErrorResponse) => {
                this.handleError(error);

                this.feedbackService.showMessage(error.message, TASK_MESSAGES.CREATED_FAILED, EFeedbackType.Error);
            }
        });
    }

    editTask(request: TaskEditRequest): void {
        this.taskService.editTask(request).subscribe({
            next: response => {
                this.getTasks();

                this.feedbackService.showMessage(response.message, TASK_MESSAGES.EDITED_SUCCESSFULLY, EFeedbackType.Success);
            },

            error: (error: HttpErrorResponse) => {
                this.handleError(error);

                this.feedbackService.showMessage(error.message, TASK_MESSAGES.EDITED_FAILED, EFeedbackType.Error);
            }
        });
    }

    deleteTask(taskId: string): void {
        this.taskService.deleteTask(taskId).subscribe({
            next: response => {
                this.getTasks();

                this.feedbackService.showMessage(response.message, TASK_MESSAGES.DELETED_SUCCESSFULLY, EFeedbackType.Success);
            },

            error: (error: HttpErrorResponse) => {
                this.handleError(error);

                this.feedbackService.showMessage(error.message, TASK_MESSAGES.DELETED_FAILED, EFeedbackType.Error);
            }
        });
    }


    // =========================
    // Search / filters / sorting
    // =========================

    searchTasks(search: string): void {
        this.taskDataState.setSearch(search);
        this.getTasks();
    }

    selectStatus(status: SelectableOption): void {
        this.taskDataState.setStatus(status);
        this.getTasks();
    }

    selectPriority(priority: SelectableOption): void {
        this.taskDataState.setPriority(priority);
        this.getTasks();
    }

    orderTasks(sort: string): void {
        this.taskDataState.toggleSort(sort);
        this.getTasks();
    }


    // =========================
    // Pagination
    // =========================

    changePage(page: number): void {
        this.taskDataState.setPage(page);
        this.getTasks();
    }


    // =========================
    // State actions
    // =========================

    clearSelectedTask(): void {
        this.taskDataState.clearSelectedTask();
    }


    // =========================
    // Private helpers
    // =========================

    private handleError(error: HttpErrorResponse): void {
        const response = error.error as ResultResponse<null>;

        this.taskDataState.setError(response?.message ?? 'Ocorreu um erro inesperado.');
    }
}