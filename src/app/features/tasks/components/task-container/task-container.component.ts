import { Component, computed, HostListener, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { SelectableOption } from '@shared/models/selectables.models';

import { ETaskSort } from '../../enums/task.enum';
import { TaskFacade } from '../../facades/task.facade';
import { TaskCreateRequest, TaskEditRequest } from '../../models/task.models';
import { TaskUiState } from '../../states/task-ui.state';

import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskOptionsComponent } from '../task-options/task-options.component';
import { TaskViewComponent } from '../task-view/task-view.component';
import { TaskComponent } from '../task/task.component';

@Component({
    selector: 'app-task-container',
    providers: [
        TaskUiState
    ],
    imports: [
        TaskComponent,
        ReactiveFormsModule,
        FormsModule,
        TaskFormComponent,
        TaskOptionsComponent,
        ConfirmationModalComponent,
        TaskViewComponent,
        NzCheckboxModule,
        NzDatePickerModule,
        NzIconModule,
        NzSelectModule
    ],
    templateUrl: './task-container.component.html',
    styleUrl: './task-container.component.scss'
})
export class TaskContainerComponent {

    private readonly taskFacade = inject(TaskFacade);
    private readonly taskUiState = inject(TaskUiState);

    readonly tasks = this.taskFacade.tasks;
    readonly pagedResponse = this.taskFacade.pagedResponse;
    readonly selectedTask = this.taskFacade.selectedTask;

    readonly selectedStatus = this.taskFacade.selectedStatus;
    readonly selectedPriority = this.taskFacade.selectedPriority;
    readonly selectedStartDate = this.taskFacade.selectedStartDate;
    readonly selectedEndDate = this.taskFacade.selectedEndDate;

    readonly priorityFormOptions = this.taskFacade.priorityOptions;
    readonly statusFormOptions = this.taskFacade.statusOptions;

    readonly currentPage = this.taskFacade.currentPage;

    readonly startDate = computed(() =>
        this.parseDate(this.selectedStartDate())
    );

    readonly endDate = computed(() =>
        this.parseDate(this.selectedEndDate())
    );

    readonly selectedPriorityId = computed(() =>
        this.selectedPriority().id ?? 0
    );

    readonly selectedStatusId = computed(() =>
        this.selectedStatus().id ?? 0
    );

    readonly activeTaskId = this.taskUiState.activeTaskId;
    readonly checkedTaskIds = this.taskUiState.checkedTaskIds;
    readonly selectedTaskPosition = this.taskUiState.selectedTaskPosition;
    readonly activeModal = this.taskUiState.activeModal;
    readonly isClosingTaskDetails = this.taskUiState.isClosingTaskDetails;

    readonly searchControl = new FormControl('', { nonNullable: true });
    readonly pageInput = new FormControl<number | null>(null);

    readonly statusOptions = computed<SelectableOption[]>(() => [
        {
            id: null,
            name: 'Todos os status'
        },
        ...this.taskFacade.statusOptions()
    ]);

    readonly priorityOptions = computed<SelectableOption[]>(() => [
        {
            id: null,
            name: 'Todas as prioridades'
        },
        ...this.taskFacade.priorityOptions()
    ]);

    readonly taskFormMode = computed<'create' | 'edit'>(() =>
        this.activeModal() === 'edit' ? 'edit' : 'create'
    );

    readonly visiblePages = computed(() => {
        const totalPages = this.pagedResponse()?.totalPages ?? 0;
        const currentPage = this.currentPage();

        if (totalPages === 0) {
            return [];
        }

        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        if (currentPage === 1) {
            return [1, 2, 3];
        }

        if (currentPage === totalPages) {
            return [totalPages - 2, totalPages - 1, totalPages];
        }

        return [currentPage - 1, currentPage, currentPage + 1];
    });

    readonly areVisibleTasksChecked = computed(() => {
        return this.tasks().length > 0 &&
            this.tasks().every(task => this.checkedTaskIds().has(task.id));
    });

    readonly TaskSort = ETaskSort;

    ngOnInit(): void {
        this.taskFacade.loadSelectables();
        this.taskFacade.getTasks();

        this.searchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(search => {
                this.taskFacade.searchTasks(search);
            });
    }

    selectPriorityById(id: number | null): void {
        const selectedId = id ?? 0;

        const priority = this.priorityOptions()
            .find(option => (option.id ?? 0) === selectedId);

        if (!priority)
            return;

        this.taskFacade.selectPriority(priority);
    }

    selectStatusById(id: number | null): void {
        const selectedId = id ?? 0;

        const status = this.statusOptions()
            .find(option => (option.id ?? 0) === selectedId);

        if (!status)
            return;

        this.taskFacade.selectStatus(status);
    }

    selectStartDate(date: Date | null): void {
        this.taskFacade.selectStartDate(this.formatDate(date));
    }

    selectEndDate(date: Date | null): void {
        this.taskFacade.selectEndDate(this.formatDate(date));
    }

    clearFilters(): void {
        this.searchControl.reset();

        this.taskFacade.clearFilters();
    }

    orderTasks(sort: string): void {
        this.taskFacade.orderTasks(sort);
        this.taskUiState.clearCheckedTasks();
    }

    changePage(page: number | null): void {
        const totalPages = this.pagedResponse()?.totalPages ?? 0;

        if (page === null || page < 1 || page > totalPages)
            return;

        this.taskUiState.clearCheckedTasks();
        this.taskFacade.changePage(page);
    }

    goToPage(input: HTMLInputElement): void {
        this.changePage(this.pageInput.value);

        input.blur();
    }

    saveTask(request: TaskCreateRequest | TaskEditRequest): void {
        if (this.taskFormMode() === 'create') {
            this.taskFacade.addTask(request as TaskCreateRequest);
        }
        else {
            this.taskFacade.editTask(request as TaskEditRequest);
        }

        this.closeModal();
    }

    deleteTask(): void {
        const taskId = this.activeTaskId();

        if (!taskId)
            return;

        this.taskFacade.deleteTask([taskId]);

        this.closeModal();
    }

    deleteCheckedTasks(): void {
        if (this.checkedTaskIds().size === 0)
            return;

        this.taskFacade.deleteTask(Array.from(this.checkedTaskIds()));

        this.taskUiState.clearCheckedTasks();
        this.closeModal();
    }

    openTaskForm(mode: 'create' | 'edit'): void {
        if (mode === 'edit') {
            const taskId = this.activeTaskId();

            if (!taskId)
                return;

            this.taskFacade.getTaskById(taskId);
        }
        else {
            this.taskFacade.clearSelectedTask();
        }

        this.taskUiState.openModal(mode);
        this.taskUiState.closeTaskOptions();
    }

    openTaskDetails(): void {
        const taskId = this.activeTaskId();

        if (!taskId)
            return;

        this.taskFacade.getTaskById(taskId);

        this.taskUiState.openModal('view');
        this.taskUiState.closeTaskOptions();
    }

    openTaskDetailsById(taskId: string): void {
        this.taskUiState.setActiveTask(taskId);

        this.openTaskDetails();
    }

    closeTaskDetails(): void {
        this.taskUiState.startClosingTaskDetails();

        setTimeout(() => {
            this.taskUiState.closeModal();
            this.taskUiState.finishClosingTaskDetails();
        }, 250);
    }

    openTaskOptions(taskId: string, element: HTMLElement): void {
        const taskPage = element.closest('.task-page') as HTMLElement | null;
        const container = element.closest('.container') as HTMLElement | null;

        if (!taskPage || !container)
            return;

        const rect = element.getBoundingClientRect();
        const taskPageRect = taskPage.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const optionsHeight = 60;
        const spaceBelow = containerRect.bottom - rect.bottom;
        const openUpward = spaceBelow < optionsHeight;

        this.taskUiState.setActiveTask(taskId);

        this.taskUiState.setTaskOptionsPosition({
            top: openUpward ? rect.top - taskPageRect.top - optionsHeight : rect.bottom - taskPageRect.top,
            right: taskPageRect.right - rect.right + 15,
            openUpward
        });
    }

    closeTaskOptions(): void {
        this.taskUiState.closeTaskOptions();
    }

    closeModal(): void {
        this.taskUiState.closeModal();
    }

    openDeleteConfirmation(): void {
        if (!this.activeTaskId())
            return;

        this.taskUiState.openModal('delete');
        this.taskUiState.closeTaskOptions();
    }

    openDeleteCheckedConfirmation(): void {
        if (this.checkedTaskIds().size === 0)
            return;

        this.taskUiState.openModal('deleteChecked');
    }

    toggleCheckedTask(taskId: string): void {
        this.taskUiState.toggleCheckedTask(taskId);
    }

    toggleAllVisibleTasks(): void {
        const taskIds = this.tasks().map(task => task.id);

        this.taskUiState.toggleAllCheckedTasks(taskIds);
    }

    private formatDate(date: Date | null): string | null {
        if (!date) {
            return null;
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    private parseDate(date: string | null): Date | null {
        if (!date) {
            return null;
        }
        const [year, month, day] = date.split('-').map(Number);

        return new Date(year, month - 1, day);
    }

    @HostListener('document:click')
    onDocumentClick(): void {
        this.closeTaskOptions();
    }
}