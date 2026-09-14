import { Component, computed, HostListener, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { DatePickerComponent } from '@shared/components/date-picker/date-picker.component';
import { DropdownComponent } from '@shared/components/dropdown/dropdown';
import { SelectableOption } from '@shared/models/selectables.models';

import { ETaskSort } from '../../enums/task.enum';
import { TaskFacade } from '../../facades/task.facade';
import { TaskCreateRequest, TaskEditRequest } from '../../models/task.models';
import { TaskUiState } from '../../states/task-ui.state';

import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskOptionsComponent } from '../task-options/task-options.component';
import { TaskViewComponent } from '../task-view/task-view.component';
import { TaskComponent } from '../task/task.component';
import { LucidePlus, LucideRotateCcw, LucideSearch, LucideTrash } from '@lucide/angular';


@Component({
  selector: 'app-task-container',
  providers: [TaskUiState],
  imports: [
    TaskComponent,
    ReactiveFormsModule,
    DropdownComponent,
    TaskFormComponent,
    TaskOptionsComponent,
    ConfirmationModalComponent,
    TaskViewComponent,
    DatePickerComponent,
    LucideTrash,
    LucidePlus,
    LucideRotateCcw,
    LucideSearch,

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


  readonly activeTaskId = this.taskUiState.activeTaskId;
  readonly checkedTaskIds = this.taskUiState.checkedTaskIds;
  readonly selectedTaskPosition = this.taskUiState.selectedTaskPosition;
  readonly activeModal = this.taskUiState.activeModal;
  readonly isClosingTaskDetails = this.taskUiState.isClosingTaskDetails;


  readonly allTasksControl = new FormControl(false, { nonNullable: true });

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
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
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
      this.tasks().every(task =>
        this.checkedTaskIds().has(task.id)
      );
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


  selectStatus(status: SelectableOption): void {
    this.taskFacade.selectStatus(status);
  }

  selectPriority(priority: SelectableOption): void {
    this.taskFacade.selectPriority(priority);
  }

  selectStartDate(date: string | null): void {
    this.taskFacade.selectStartDate(date);
  }

  selectEndDate(date: string | null): void {
    this.taskFacade.selectEndDate(date);
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

    if (page === null || page < 1 || page > totalPages) return;

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

    if (!taskId) return;

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

      if (!taskId) return;

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

    if (!taskId) return;

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
    const wrapper = element.closest('.tasks-wrapper') as HTMLElement | null;

    if (!wrapper) return;

    const rect = element.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    this.taskUiState.setActiveTask(taskId);

    this.taskUiState.setTaskOptionsPosition({
      top: rect.bottom - wrapperRect.top - 30,
      right: wrapperRect.right - rect.right + 20
    });
  }

  closeTaskOptions(): void {
    this.taskUiState.closeTaskOptions();
  }


  closeModal(): void {
    this.taskUiState.closeModal();
  }

  openDeleteConfirmation(): void {
    if (!this.activeTaskId()) {
      return;
    }

    this.taskUiState.openModal('delete');
    this.taskUiState.closeTaskOptions();
  }

  openDeleteCheckedConfirmation(): void {
    if (this.checkedTaskIds().size === 0) {
      return;
    }

    this.taskUiState.openModal('deleteChecked');
  }

  toggleCheckedTask(taskId: string): void {
    this.taskUiState.toggleCheckedTask(taskId);
  }

  toggleAllVisibleTasks(): void {
    const taskIds = this.tasks()
      .map(task => task.id);

    this.taskUiState.toggleAllCheckedTasks(taskIds);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeTaskOptions();
  }
}