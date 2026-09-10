import { computed, Injectable, signal } from '@angular/core';
import { TaskPagedParams, TaskResponse } from '@features/tasks/models/task.models';

import { PagedResponse } from '@shared/models/pagination.models';
import { SelectableOption } from '@shared/models/selectables.models';
import { ESortOrder } from '../enums/task.enum';



@Injectable({
    providedIn: 'root'
})

export class TaskDataState {

    // =========================
    // Query state
    // =========================

    private readonly _pagedParams = new TaskPagedParams();

    readonly pagedParams = this._pagedParams;


    // =========================
    // Internal state
    // =========================

    private readonly _tasks = signal<TaskResponse[]>([]);

    private readonly _pagedResponse = signal<PagedResponse<TaskResponse> | null>(null);

    private readonly _selectedTask = signal<TaskResponse | null>(null);

    private readonly _statusOptions = signal<SelectableOption[]>([]);

    private readonly _priorityOptions = signal<SelectableOption[]>([]);

    private readonly _selectedStatus = signal<SelectableOption>({
        id: null,
        name: 'Todos os status'
    });

    private readonly _selectedPriority = signal<SelectableOption>({
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
    // Task state
    // =========================

    setTasks(response: PagedResponse<TaskResponse>): void {
        this._pagedResponse.set(response);
        this._tasks.set(response.items);
    }

    clearTasks(): void {
        this._tasks.set([]);
        this._pagedResponse.set(null);
    }

    setSelectedTask(task: TaskResponse): void {
        this._selectedTask.set(task);
    }

    clearSelectedTask(): void {
        this._selectedTask.set(null);
    }


    // =========================
    // Selectables state
    // =========================

    setStatusOptions(options: SelectableOption[]): void {
        this._statusOptions.set(options);
    }

    setPriorityOptions(options: SelectableOption[]): void {
        this._priorityOptions.set(options);
    }


    // =========================
    // Filters state
    // =========================

    setSearch(search: string): void {
        this._pagedParams.search = search.trim() || null;
        this.resetPage();
    }

    setStatus(status: SelectableOption): void {
        this._selectedStatus.set(status);
        this._pagedParams.taskStatusId = status.id;

        this.resetPage();
    }

    setPriority(priority: SelectableOption): void {
        this._selectedPriority.set(priority);
        this._pagedParams.taskPriorityId = priority.id;

        this.resetPage();
    }


    // =========================
    // Pagination / sorting state
    // =========================

    setPage(page: number): void {
        this._pagedParams.pageNumber = page;
    }

    toggleSort(sort: string): void {
        this._pagedParams.order =  this._pagedParams.order === ESortOrder.Asc? ESortOrder.Desc : ESortOrder.Asc;
        this._pagedParams.sort = sort;
    }


    // =========================
    // Error state
    // =========================

    setError(message: string): void {
        this._errorMessage.set(message);
    }


    // =========================
    // Private helpers
    // =========================

    private resetPage(): void {
        this._pagedParams.pageNumber = 1;
    }
}