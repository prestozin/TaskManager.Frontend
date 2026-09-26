import { computed, Injectable, signal } from '@angular/core';

import { EReportPeriod } from '@features/report/enums/report.enum';
import {
    ReportParams,
    ReportResponse
} from '@features/report/models/report.models';
import {
    ESortOrder,
    ETaskFilter,
    ETaskModal,
    ETaskSort
} from '@features/tasks/enums/task.enum';
import {
    TaskOptionsPosition,
    TaskPagedParams,
    TaskResponse
} from '@features/tasks/models/task.models';
import { PagedResponse } from '@shared/models/pagination.models';
import { SelectableOption } from '@shared/models/selectables.models';
import { getDateMonthsAgo } from '@shared/utils/date.util';

@Injectable({
    providedIn: 'root'
})
export class TaskState {

    readonly pagedParams = new TaskPagedParams();
    readonly reportParams = new ReportParams();

    readonly tasks = signal<TaskResponse[]>([]);
    readonly pagedResponse = signal<PagedResponse<TaskResponse> | null>(null);
    readonly selectedTask = signal<TaskResponse | null>(null);

    readonly selectedStartDate = signal<string | null>(getDateMonthsAgo(1));
    readonly selectedEndDate = signal<string | null>(getDateMonthsAgo(0));

    readonly statusOptions = signal<SelectableOption[]>([]);
    readonly priorityOptions = signal<SelectableOption[]>([]);

    readonly selectedStatus = signal<SelectableOption>({
        id: ETaskFilter.All,
        name: 'Todos os status'
    });

    readonly selectedPriority = signal<SelectableOption>({
        id: ETaskFilter.All,
        name: 'Todas as prioridades'
    });

    readonly activeTaskId = signal<string | null>(null);
    readonly checkedTaskIds = signal<Set<string>>(new Set());
    readonly taskOptionsPosition = signal<TaskOptionsPosition | null>(null);

    readonly activeModal = signal<ETaskModal | null>(null);
    readonly isClosingTaskDetails = signal(false);

    readonly confirmBeforeDelete = signal(true);
    readonly pageSize = signal(this.pagedParams.pageSize);

    readonly report = signal<ReportResponse | null>(null);

    readonly selectedReportPeriod = signal(EReportPeriod.ThirtyDays);
    readonly selectedReportStartDate = signal<string | null>(null);
    readonly selectedReportEndDate = signal<string | null>(null);

    readonly currentPage = computed(
        () => this.pagedResponse()?.pageNumber ?? 1
    );

    constructor() {
        this.pagedParams.startDate = this.selectedStartDate();
        this.pagedParams.endDate = this.selectedEndDate();
    }

    setTasks(response: PagedResponse<TaskResponse>): void {
        this.pagedResponse.set(response);
        this.tasks.set(response.items);
    }

    clearTasks(): void {
        this.tasks.set([]);
        this.pagedResponse.set(null);
    }

    setSelectedTask(task: TaskResponse): void {
        this.selectedTask.set(task);
    }

    clearSelectedTask(): void {
        this.selectedTask.set(null);
    }

    setStatusOptions(options: SelectableOption[]): void {
        this.statusOptions.set(options);
    }

    setPriorityOptions(options: SelectableOption[]): void {
        this.priorityOptions.set(options);
    }

    setSearch(search: string): void {
        this.pagedParams.search = search.trim() || null;

        this.resetPage();
    }

    setStatus(status: SelectableOption): void {
        this.selectedStatus.set(status);

        this.pagedParams.taskStatusId =
            status.id === ETaskFilter.All ? null : status.id;

        this.resetPage();
    }

    setPriority(priority: SelectableOption): void {
        this.selectedPriority.set(priority);

        this.pagedParams.taskPriorityId =
            priority.id === ETaskFilter.All ? null : priority.id;

        this.resetPage();
    }

    setStartDate(date: string | null): void {
        this.selectedStartDate.set(date);
        this.pagedParams.startDate = date;

        this.resetPage();
    }

    setEndDate(date: string | null): void {
        this.selectedEndDate.set(date);
        this.pagedParams.endDate = date;

        this.resetPage();
    }

    clearFilters(): void {
        const startDate = getDateMonthsAgo(1);
        const endDate = getDateMonthsAgo(0);

        this.selectedStatus.set({
            id: ETaskFilter.All,
            name: 'Todos os status'
        });

        this.selectedPriority.set({
            id: ETaskFilter.All,
            name: 'Todas as prioridades'
        });

        this.selectedStartDate.set(startDate);
        this.selectedEndDate.set(endDate);

        this.pagedParams.search = null;
        this.pagedParams.taskStatusId = null;
        this.pagedParams.taskPriorityId = null;
        this.pagedParams.startDate = startDate;
        this.pagedParams.endDate = endDate;

        this.resetPage();
    }

    setPage(page: number): void {
        this.pagedParams.pageNumber = page;
    }

    setPageSize(pageSize: number): void {
        this.pageSize.set(pageSize);
        this.pagedParams.pageSize = pageSize;

        this.resetPage();
    }

    toggleSort(sort: ETaskSort): void {
        this.pagedParams.order =
            this.pagedParams.order === ESortOrder.Asc
                ? ESortOrder.Desc
                : ESortOrder.Asc;

        this.pagedParams.sort = sort;
    }

    resetAfterCreate(): void {
        this.pagedParams.pageNumber = 1;
        this.pagedParams.sort = ETaskSort.CreatedAt;
        this.pagedParams.order = ESortOrder.Desc;
    }

    setActiveTask(taskId: string): void {
        this.activeTaskId.set(taskId);
    }

    toggleCheckedTask(taskId: string): void {
        const checkedTaskIds = new Set(this.checkedTaskIds());

        if (checkedTaskIds.has(taskId))
            checkedTaskIds.delete(taskId);
        else
            checkedTaskIds.add(taskId);

        this.checkedTaskIds.set(checkedTaskIds);
    }

    toggleAllCheckedTasks(taskIds: string[]): void {
        const allChecked = taskIds.every(taskId =>
            this.checkedTaskIds().has(taskId)
        );

        if (allChecked)
            this.checkedTaskIds.set(new Set());
        else
            this.checkedTaskIds.set(new Set(taskIds));
    }

    clearCheckedTasks(): void {
        this.checkedTaskIds.set(new Set());
    }

    setTaskOptionsPosition(position: TaskOptionsPosition): void {
        this.taskOptionsPosition.set(position);
    }

    closeTaskOptions(): void {
        this.taskOptionsPosition.set(null);
    }

    openModal(modal: ETaskModal): void {
        this.activeModal.set(modal);
    }

    closeModal(): void {
        this.activeModal.set(null);
    }

    startClosingTaskDetails(): void {
        this.isClosingTaskDetails.set(true);
    }

    finishClosingTaskDetails(): void {
        this.isClosingTaskDetails.set(false);
    }

    setConfirmBeforeDelete(confirmBeforeDelete: boolean): void {
        this.confirmBeforeDelete.set(confirmBeforeDelete);
    }

    resetUiState(): void {
        this.activeTaskId.set(null);
        this.checkedTaskIds.set(new Set());
        this.taskOptionsPosition.set(null);
        this.activeModal.set(null);
        this.isClosingTaskDetails.set(false);
    }

    setReport(report: ReportResponse): void {
        this.report.set(report);
    }

    clearReport(): void {
        this.report.set(null);
    }

    setReportPeriod(period: EReportPeriod): void {
        this.selectedReportPeriod.set(period);
    }

    setReportDateRange(
        startDate: string | null,
        endDate: string | null
    ): void {
        this.selectedReportStartDate.set(startDate);
        this.selectedReportEndDate.set(endDate);

        this.reportParams.startDate = startDate;
        this.reportParams.endDate = endDate;
        this.reportParams.pageNumber = 1;
    }

    setReportStartDate(date: string | null): void {
        this.selectedReportStartDate.set(date);
        this.reportParams.startDate = date;
        this.reportParams.pageNumber = 1;
    }

    setReportEndDate(date: string | null): void {
        this.selectedReportEndDate.set(date);
        this.reportParams.endDate = date;
        this.reportParams.pageNumber = 1;
    }

    private resetPage(): void {
        this.pagedParams.pageNumber = 1;
    }
}