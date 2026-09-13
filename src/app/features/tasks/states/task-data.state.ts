import { computed, Injectable, signal } from '@angular/core';

import { TaskPagedParams, TaskResponse } from '@features/tasks/models/task.models';
import { PagedResponse } from '@shared/models/pagination.models';
import { SelectableOption } from '@shared/models/selectables.models';

import { ESortOrder } from '../enums/task.enum';

@Injectable({
    providedIn: 'root'
})
export class TaskDataState {

    readonly pagedParams = new TaskPagedParams();

    readonly tasks = signal<TaskResponse[]>([]);
    readonly pagedResponse = signal<PagedResponse<TaskResponse> | null>(null);
    readonly selectedTask = signal<TaskResponse | null>(null);

    readonly selectedStartDate = signal<string | null>(this.getDateMonthsAgo(1));

    readonly selectedEndDate = signal<string | null>(this.getDateMonthsAgo(0));

    readonly statusOptions = signal<SelectableOption[]>([]);
    readonly priorityOptions = signal<SelectableOption[]>([]);

    readonly selectedStatus = signal<SelectableOption>({
        id: null,
        name: 'Todos os status'
    });

    readonly selectedPriority = signal<SelectableOption>({
        id: null,
        name: 'Todas as prioridades'
    });

    readonly errorMessage = signal<string | null>(null);

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
        this.pagedParams.taskStatusId = status.id;

        this.resetPage();
    }

    setPriority(priority: SelectableOption): void {
        this.selectedPriority.set(priority);
        this.pagedParams.taskPriorityId = priority.id;

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
        const startDate = this.getDateMonthsAgo(1);
        const endDate = this.getDateMonthsAgo(0);

        this.selectedStatus.set({
            id: null,
            name: 'Todos os status'
        });

        this.selectedPriority.set({
            id: null,
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

    toggleSort(sort: string): void {
        this.pagedParams.order =
            this.pagedParams.order === ESortOrder.Asc ? ESortOrder.Desc : ESortOrder.Asc;

        this.pagedParams.sort = sort;
    }

    setError(message: string): void {
        this.errorMessage.set(message);
    }

    private resetPage(): void {
        this.pagedParams.pageNumber = 1;
    }

    private getDateMonthsAgo(monthsAgo: number): string {
        const date = new Date();

        date.setMonth(date.getMonth() - monthsAgo);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}