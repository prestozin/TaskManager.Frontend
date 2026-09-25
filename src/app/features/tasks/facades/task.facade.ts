import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { FeedbackService } from '@core/services/feedback/feedback.service';

import { TASK_MESSAGES } from '@shared/constants/messages';
import { EFeedbackType } from '@shared/enums/feedback.enum';
import { SelectableOption } from '@shared/models/selectables.models';
import { getHttpErrorMessage } from '@shared/utils/http-error.util';

import { ETaskSort } from '../enums/task.enum';
import { DeleteTaskRequest, TaskCreateRequest, TaskEditRequest } from '../models/task.models';

import { TaskService } from '../services/task.service';

import { TaskDataState } from '../states/task-data.state';
import { ReportState } from '@features/report/states/report.state';


@Injectable({
    providedIn: 'root'
})

export class TaskFacade {

    private readonly taskService = inject(TaskService);
    private readonly taskDataState = inject(TaskDataState);
    private readonly reportState = inject(ReportState);
    private readonly feedbackService = inject(FeedbackService);

    readonly handleError = getHttpErrorMessage;


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

    get selectedStartDate() {
        return this.taskDataState.selectedStartDate;
    }

    get selectedEndDate() {
        return this.taskDataState.selectedEndDate;
    }

    get currentPage() {
        return this.taskDataState.currentPage;
    }


    get report() {
        return this.reportState.report;
    }

    get reportStartDate() {
        return this.reportState.selectedStartDate;
    }

    get reportEndDate() {
        return this.reportState.selectedEndDate;
    }


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

    getReport(): void {
        this.taskService.getReport(this.reportState.reportParams).subscribe({
            next: response => {
                if (response.isSuccess) {
                    this.reportState.setReport(response.data);
                }
            },

            error: (error: HttpErrorResponse) => {
                this.handleError(error);
                this.reportState.clearReport();
            }
        });
    }


    addTask(request: TaskCreateRequest): void {
        this.taskService.addTask(request).subscribe({
            next: response => {
                this.taskDataState.pagedParams.pageNumber = 1;
                this.taskDataState.pagedParams.sort = ETaskSort.CreatedAt;
                this.taskDataState.pagedParams.order = 'desc';
                this.getTasks();

                this.feedbackService.showMessage(response.message, TASK_MESSAGES.CREATED_SUCCESSFULLY, EFeedbackType.Success);
            },

            error: (error: HttpErrorResponse) => {
                const message = this.handleError(error);

                this.feedbackService.showMessage(message, TASK_MESSAGES.CREATED_FAILED, EFeedbackType.Error);
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

                this.feedbackService.showMessage(error.message, TASK_MESSAGES.EDITED_FAILED, EFeedbackType.Error
                );
            }
        });
    }

    deleteTask(taskId: string[]): void {
        const request: DeleteTaskRequest = {
            taskId
        };

        this.taskService.deleteTask(request).subscribe({
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

    selectStartDate(date: string | null): void {
        this.taskDataState.setStartDate(date);
        this.getTasks();
    }

    selectEndDate(date: string | null): void {
        this.taskDataState.setEndDate(date);
        this.getTasks();
    }

    clearFilters(): void {
        this.taskDataState.clearFilters();
        this.getTasks();
    }

    orderTasks(sort: string): void {
        this.taskDataState.toggleSort(sort);
        this.getTasks();
    }

    changePage(page: number): void {
        this.taskDataState.setPage(page);
        this.getTasks();
    }

    clearSelectedTask(): void {
        this.taskDataState.clearSelectedTask();
    }


    selectReportStartDate(date: string | null): void {
        this.reportState.setStartDate(date);
    }

    selectReportEndDate(date: string | null): void {
        this.reportState.setEndDate(date);
    }

    clearReportFilters(): void {
        this.reportState.clearFilters();
        this.getReport();
    }

}