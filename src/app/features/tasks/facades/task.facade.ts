import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { FeedbackService } from '@core/services/feedback/feedback.service';
import { EReportPeriod } from '@features/report/enums/report.enum';
import { ETaskSort } from '@features/tasks/enums/task.enum';
import {
    TaskCreateRequest,
    TaskEditRequest
} from '@features/tasks/models/task.models';
import { TaskService } from '@features/tasks/services/task.service';
import { TaskState } from '@features/tasks/states/task.state';
import { Messages } from '@shared/constants/messages';
import { EFeedbackType } from '@shared/enums/feedback.enum';
import { SelectableOption } from '@shared/models/selectables.models';
import { formatDateToApi } from '@shared/utils/date.util';
import { getHttpErrorMessage } from '@shared/utils/http-error.util';

@Injectable({
    providedIn: 'root'
})
export class TaskFacade {

    private readonly taskService = inject(TaskService);
    private readonly taskState = inject(TaskState);
    private readonly feedbackService = inject(FeedbackService);

    get tasks() {
        return this.taskState.tasks;
    }

    get pagedResponse() {
        return this.taskState.pagedResponse;
    }

    get selectedTask() {
        return this.taskState.selectedTask;
    }

    get statusOptions() {
        return this.taskState.statusOptions;
    }

    get priorityOptions() {
        return this.taskState.priorityOptions;
    }

    get selectedStatus() {
        return this.taskState.selectedStatus;
    }

    get selectedPriority() {
        return this.taskState.selectedPriority;
    }

    get selectedStartDate() {
        return this.taskState.selectedStartDate;
    }

    get selectedEndDate() {
        return this.taskState.selectedEndDate;
    }

    get currentPage() {
        return this.taskState.currentPage;
    }

    get confirmBeforeDelete() {
        return this.taskState.confirmBeforeDelete;
    }

    get pageSize() {
        return this.taskState.pageSize;
    }

    get report() {
        return this.taskState.report;
    }

    get selectedReportPeriod() {
        return this.taskState.selectedReportPeriod;
    }

    get selectedReportStartDate() {
        return this.taskState.selectedReportStartDate;
    }

    get selectedReportEndDate() {
        return this.taskState.selectedReportEndDate;
    }

    getTasks(): void {
        this.taskService.getPaged(this.taskState.pagedParams).subscribe({
            next: response => {
                if (!response.isSuccess) {
                    this.taskState.clearTasks();
                    return;
                }

                this.taskState.setTasks(response.data);
            },

            error: () => {
                this.taskState.clearTasks();
            }
        });
    }

    getTaskById(taskId: string): void {
        this.taskState.clearSelectedTask();

        this.taskService.getTaskById(taskId).subscribe({
            next: response => {
                if (!response.isSuccess)
                    return;

                this.taskState.setSelectedTask(response.data);
            },

            error: (error: HttpErrorResponse) => {
                this.feedbackService.showMessage(
                    getHttpErrorMessage(error),
                    '',
                    EFeedbackType.Error
                );
            }
        });
    }

    loadSelectables(): void {
        this.taskService.getSelectables().subscribe({
            next: response => {
                if (!response.isSuccess)
                    return;

                this.taskState.setStatusOptions(response.data.status);
                this.taskState.setPriorityOptions(response.data.priority);
            }
        });
    }

    addTask(request: TaskCreateRequest): void {
        this.taskService.addTask(request).subscribe({
            next: response => {
                this.taskState.resetAfterCreate();
                this.getTasks();

                this.feedbackService.showMessage(
                    response.message,
                    Messages.TaskCreatedSuccessfully,
                    EFeedbackType.Success
                );
            },

            error: (error: HttpErrorResponse) => {
                this.feedbackService.showMessage(
                    getHttpErrorMessage(error),
                    Messages.TaskCreateFailed,
                    EFeedbackType.Error
                );
            }
        });
    }

    editTask(request: TaskEditRequest): void {
        this.taskService.editTask(request).subscribe({
            next: response => {
                this.getTasks();

                this.feedbackService.showMessage(
                    response.message,
                    Messages.TaskEditedSuccessfully,
                    EFeedbackType.Success
                );
            },

            error: (error: HttpErrorResponse) => {
                this.feedbackService.showMessage(
                    getHttpErrorMessage(error),
                    Messages.TaskEditFailed,
                    EFeedbackType.Error
                );
            }
        });
    }

    deleteTask(taskIds: string[]): void {
        this.taskService.deleteTask({ taskId: taskIds }).subscribe({
            next: response => {
                this.getTasks();

                this.feedbackService.showMessage(
                    response.message,
                    Messages.TaskDeletedSuccessfully,
                    EFeedbackType.Success
                );
            },

            error: (error: HttpErrorResponse) => {
                this.feedbackService.showMessage(
                    getHttpErrorMessage(error),
                    Messages.TaskDeleteFailed,
                    EFeedbackType.Error
                );
            }
        });
    }

    searchTasks(search: string): void {
        this.taskState.setSearch(search);
        this.getTasks();
    }

    selectStatus(status: SelectableOption): void {
        this.taskState.setStatus(status);
        this.getTasks();
    }

    selectPriority(priority: SelectableOption): void {
        this.taskState.setPriority(priority);
        this.getTasks();
    }

    selectStartDate(date: string | null): void {
        this.taskState.setStartDate(date);
        this.getTasks();
    }

    selectEndDate(date: string | null): void {
        this.taskState.setEndDate(date);
        this.getTasks();
    }

    clearFilters(): void {
        this.taskState.clearFilters();
        this.getTasks();
    }

    orderTasks(sort: ETaskSort): void {
        this.taskState.toggleSort(sort);
        this.getTasks();
    }

    changePage(page: number): void {
        this.taskState.setPage(page);
        this.getTasks();
    }

    setPageSize(pageSize: number): void {
        this.taskState.setPageSize(pageSize);
    }

    setConfirmBeforeDelete(confirmBeforeDelete: boolean): void {
        this.taskState.setConfirmBeforeDelete(confirmBeforeDelete);
    }

    clearSelectedTask(): void {
        this.taskState.clearSelectedTask();
    }

    initializeReport(): void {
        this.applyReportPeriod();
        this.getReport();
    }

    selectReportPeriod(period: EReportPeriod): void {
        this.taskState.setReportPeriod(period);

        this.applyReportPeriod();
        this.getReport();
    }

    selectReportStartDate(date: string | null): void {
        this.taskState.setReportStartDate(date);
        this.getReport();
    }

    selectReportEndDate(date: string | null): void {
        this.taskState.setReportEndDate(date);
        this.getReport();
    }

    clearReportFilters(): void {
        this.taskState.setReportPeriod(EReportPeriod.ThirtyDays);

        this.applyReportPeriod();
        this.getReport();
    }

    getReport(): void {
        this.taskService.getReport(this.taskState.reportParams).subscribe({
            next: response => {
                if (!response.isSuccess) {
                    this.taskState.clearReport();
                    return;
                }

                this.taskState.setReport(response.data);
            },

            error: () => {
                this.taskState.clearReport();
            }
        });
    }

    private applyReportPeriod(): void {
        const endDate = new Date();
        const startDate = new Date();

        startDate.setDate(
            endDate.getDate() - this.taskState.selectedReportPeriod()
        );

        this.taskState.setReportDateRange(
            formatDateToApi(startDate),
            formatDateToApi(endDate)
        );
    }
}