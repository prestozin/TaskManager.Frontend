import {
    Component,
    computed,
    DestroyRef,
    HostListener,
    inject,
    OnInit
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import {
    TASK_DETAILS_CLOSE_DELAY_MS
} from '@shared/constants/constants';
import { Messages } from '@shared/constants/messages';
import { SelectableOption } from '@shared/models/selectables.models';
import {
    formatDateToApi,
    parseApiDate
} from '@shared/utils/date.util';

import {
    ETaskFilter,
    ETaskFormMode,
    ETaskModal,
    ETaskSort
} from '../../enums/task.enum';
import { TaskFacade } from '../../facades/task.facade';
import {
    TaskCreateRequest,
    TaskEditRequest
} from '../../models/task.models';
import { TaskState } from '../../states/task.state';

import { TaskComponent } from '../task/task.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskOptionsComponent } from '../task-options/task-options.component';
import { TaskViewComponent } from '../task-view/task-view.component';

const TASK_OPTIONS_HEIGHT = 60;
const TASK_OPTIONS_RIGHT_OFFSET = 15;

@Component({
    selector: 'app-task-container',
    imports: [
        TaskComponent,
        TaskFormComponent,
        TaskOptionsComponent,
        TaskViewComponent,
        ConfirmationModalComponent,
        FormsModule,
        ReactiveFormsModule,
        NzCheckboxModule,
        NzDatePickerModule,
        NzIconModule,
        NzSelectModule
    ],
    templateUrl: './task-container.component.html',
    styleUrl: './task-container.component.scss'
})
export class TaskContainerComponent implements OnInit {

    private readonly taskFacade = inject(TaskFacade);
    private readonly taskState = inject(TaskState);
    private readonly destroyRef = inject(DestroyRef);

    readonly tasks = this.taskFacade.tasks;
    readonly pagedResponse = this.taskFacade.pagedResponse;
    readonly selectedTask = this.taskFacade.selectedTask;

    readonly selectedStatus = this.taskFacade.selectedStatus;
    readonly selectedPriority = this.taskFacade.selectedPriority;
    readonly selectedStartDate = this.taskFacade.selectedStartDate;
    readonly selectedEndDate = this.taskFacade.selectedEndDate;

    readonly statusFormOptions = this.taskFacade.statusOptions;
    readonly priorityFormOptions = this.taskFacade.priorityOptions;

    readonly currentPage = this.taskFacade.currentPage;
    readonly confirmBeforeDelete = this.taskFacade.confirmBeforeDelete;

    readonly activeTaskId = this.taskState.activeTaskId;
    readonly checkedTaskIds = this.taskState.checkedTaskIds;
    readonly taskOptionsPosition = this.taskState.taskOptionsPosition;
    readonly activeModal = this.taskState.activeModal;
    readonly isClosingTaskDetails = this.taskState.isClosingTaskDetails;

    readonly searchControl = new FormControl('', { nonNullable: true });
    readonly pageInput = new FormControl<number | null>(null);

    readonly startDate = computed(() =>
        parseApiDate(this.selectedStartDate())
    );

    readonly endDate = computed(() =>
        parseApiDate(this.selectedEndDate())
    );

    readonly selectedPriorityId = computed(() =>
        this.selectedPriority().id
    );

    readonly selectedStatusId = computed(() =>
        this.selectedStatus().id
    );

    readonly statusOptions = computed<SelectableOption[]>(() => [
        {
            id: ETaskFilter.All,
            name: 'Todos os status'
        },
        ...this.statusFormOptions()
    ]);

    readonly priorityOptions = computed<SelectableOption[]>(() => [
        {
            id: ETaskFilter.All,
            name: 'Todas as prioridades'
        },
        ...this.priorityFormOptions()
    ]);

    readonly taskRows = computed(() => {
        const checkedTaskIds = this.checkedTaskIds();

        return this.tasks().map(task => ({
            task,
            checked: checkedTaskIds.has(task.id)
        }));
    });

    readonly displayedTaskCount = computed(() =>
        this.tasks().length
    );

    readonly totalTaskCount = computed(() =>
        this.pagedResponse()?.totalCount ?? 0
    );

    readonly totalPages = computed(() =>
        this.pagedResponse()?.totalPages ?? 0
    );

    readonly pageInputMax = computed(() =>
        Math.max(this.totalPages(), 1)
    );

    readonly isFirstPage = computed(() =>
        this.currentPage() === 1
    );

    readonly isLastPage = computed(() =>
        this.totalPages() === 0 ||
        this.currentPage() === this.totalPages()
    );

    readonly visiblePageButtons = computed(() => {
        const totalPages = this.totalPages();
        const currentPage = this.currentPage();

        let pages: number[];

        if (totalPages === 0)
            pages = [];
        else if (totalPages <= 3)
            pages = Array.from({ length: totalPages }, (_, index) => index + 1);
        else if (currentPage === 1)
            pages = [1, 2, 3];
        else if (currentPage === totalPages)
            pages = [totalPages - 2, totalPages - 1, totalPages];
        else
            pages = [currentPage - 1, currentPage, currentPage + 1];

        return pages.map(page => ({
            page,
            active: page === currentPage
        }));
    });

    readonly areVisibleTasksChecked = computed(() =>
        this.tasks().length > 0 &&
        this.tasks().every(task => this.checkedTaskIds().has(task.id))
    );

    readonly taskFormMode = computed(() =>
        this.activeModal() === ETaskModal.Edit
            ? ETaskFormMode.Edit
            : ETaskFormMode.Create
    );

    readonly taskFormTask = computed(() =>
        this.activeModal() === ETaskModal.Edit
            ? this.selectedTask()
            : null
    );

    readonly showTaskForm = computed(() =>
        this.activeModal() === ETaskModal.Create ||
        (
            this.activeModal() === ETaskModal.Edit &&
            this.selectedTask() !== null
        )
    );

    readonly taskDetails = computed(() =>
        this.activeModal() === ETaskModal.View
            ? this.selectedTask()
            : null
    );

    readonly showDeleteConfirmation = computed(() =>
        this.activeModal() === ETaskModal.Delete ||
        this.activeModal() === ETaskModal.DeleteChecked
    );

    readonly deleteConfirmationTitle = computed(() =>
        this.activeModal() === ETaskModal.DeleteChecked
            ? Messages.DeleteTasksTitle
            : Messages.DeleteTaskTitle
    );

    readonly deleteConfirmationDescription = Messages.IrreversibleAction;
    readonly deleteConfirmationButton = Messages.DeleteButton;

    ngOnInit(): void {
        this.taskState.resetUiState();

        this.taskFacade.loadSelectables();
        this.taskFacade.getTasks();

        this.searchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(search => {
                this.taskFacade.searchTasks(search);
            });
    }

    selectPriorityById(id: number | null): void {
        const selectedId = id ?? ETaskFilter.All;

        const priority = this.priorityOptions()
            .find(option => option.id === selectedId);

        if (!priority)
            return;

        this.taskFacade.selectPriority(priority);
    }

    selectStatusById(id: number | null): void {
        const selectedId = id ?? ETaskFilter.All;

        const status = this.statusOptions()
            .find(option => option.id === selectedId);

        if (!status)
            return;

        this.taskFacade.selectStatus(status);
    }

    selectStartDate(date: Date | null): void {
        this.taskFacade.selectStartDate(formatDateToApi(date));
    }

    selectEndDate(date: Date | null): void {
        this.taskFacade.selectEndDate(formatDateToApi(date));
    }

    clearFilters(): void {
        this.searchControl.reset();

        this.taskFacade.clearFilters();
    }

    orderByCreatedAt(): void {
        this.orderTasks(ETaskSort.CreatedAt);
    }

    orderByPriority(): void {
        this.orderTasks(ETaskSort.TaskPriority);
    }

    orderByStatus(): void {
        this.orderTasks(ETaskSort.TaskStatus);
    }

    changePage(page: number | null): void {
        if (page === null || page < 1 || page > this.totalPages())
            return;

        this.taskState.clearCheckedTasks();
        this.taskFacade.changePage(page);
    }

    goToFirstPage(): void {
        this.changePage(1);
    }

    goToPreviousPage(): void {
        this.changePage(this.currentPage() - 1);
    }

    goToNextPage(): void {
        this.changePage(this.currentPage() + 1);
    }

    goToLastPage(): void {
        this.changePage(this.totalPages());
    }

    goToPage(input: HTMLInputElement): void {
        this.changePage(this.pageInput.value);

        input.blur();
    }

    saveTask(request: TaskCreateRequest | TaskEditRequest): void {
        if ('id' in request)
            this.taskFacade.editTask(request);
        else
            this.taskFacade.addTask(request);

        this.closeModal();
    }

    openCreateTaskForm(): void {
        this.taskFacade.clearSelectedTask();
        this.taskState.openModal(ETaskModal.Create);
        this.taskState.closeTaskOptions();
    }

    openEditTaskForm(): void {
        const taskId = this.activeTaskId();

        if (!taskId)
            return;

        this.taskFacade.getTaskById(taskId);

        this.taskState.openModal(ETaskModal.Edit);
        this.taskState.closeTaskOptions();
    }

    openTaskDetails(): void {
        const taskId = this.activeTaskId();

        if (!taskId)
            return;

        this.taskFacade.getTaskById(taskId);

        this.taskState.openModal(ETaskModal.View);
        this.taskState.closeTaskOptions();
    }

    openTaskDetailsById(taskId: string): void {
        this.taskState.setActiveTask(taskId);

        this.openTaskDetails();
    }

    closeTaskDetails(): void {
        this.taskState.startClosingTaskDetails();

        setTimeout(() => {
            this.taskState.closeModal();
            this.taskState.finishClosingTaskDetails();
        }, TASK_DETAILS_CLOSE_DELAY_MS);
    }

    openTaskOptions(taskId: string, element: HTMLElement): void {
        const taskPage = element.closest('.task-page') as HTMLElement | null;
        const container = element.closest('.container') as HTMLElement | null;

        if (!taskPage || !container)
            return;

        const elementRect = element.getBoundingClientRect();
        const taskPageRect = taskPage.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const spaceBelow = containerRect.bottom - elementRect.bottom;
        const openUpward = spaceBelow < TASK_OPTIONS_HEIGHT;

        this.taskState.setActiveTask(taskId);

        this.taskState.setTaskOptionsPosition({
            top: openUpward
                ? elementRect.top - taskPageRect.top - TASK_OPTIONS_HEIGHT
                : elementRect.bottom - taskPageRect.top,

            right: taskPageRect.right - elementRect.right + TASK_OPTIONS_RIGHT_OFFSET
        });
    }

    closeTaskOptions(): void {
        this.taskState.closeTaskOptions();
    }

    closeModal(): void {
        this.taskState.closeModal();
    }

    openDeleteConfirmation(): void {
        const taskId = this.activeTaskId();

        if (!taskId)
            return;

        this.taskState.closeTaskOptions();

        if (!this.confirmBeforeDelete()) {
            this.deleteTask();
            return;
        }

        this.taskState.openModal(ETaskModal.Delete);
    }

    openDeleteCheckedConfirmation(): void {
        if (this.checkedTaskIds().size === 0)
            return;

        if (!this.confirmBeforeDelete()) {
            this.deleteCheckedTasks();
            return;
        }

        this.taskState.openModal(ETaskModal.DeleteChecked);
    }

    confirmDelete(): void {
        if (this.activeModal() === ETaskModal.DeleteChecked) {
            this.deleteCheckedTasks();
            return;
        }

        this.deleteTask();
    }

    toggleCheckedTask(taskId: string): void {
        this.taskState.toggleCheckedTask(taskId);
    }

    toggleAllVisibleTasks(): void {
        const taskIds = this.tasks().map(task => task.id);

        this.taskState.toggleAllCheckedTasks(taskIds);
    }

    private orderTasks(sort: ETaskSort): void {
        this.taskFacade.orderTasks(sort);
        this.taskState.clearCheckedTasks();
    }

    private deleteTask(): void {
        const taskId = this.activeTaskId();

        if (!taskId)
            return;

        this.taskFacade.deleteTask([taskId]);

        this.closeModal();
    }

    private deleteCheckedTasks(): void {
        const checkedTaskIds = this.checkedTaskIds();

        if (checkedTaskIds.size === 0)
            return;

        this.taskFacade.deleteTask(Array.from(checkedTaskIds));

        this.taskState.clearCheckedTasks();
        this.closeModal();
    }

    @HostListener('document:click')
    onDocumentClick(): void {
        this.closeTaskOptions();
    }
}
