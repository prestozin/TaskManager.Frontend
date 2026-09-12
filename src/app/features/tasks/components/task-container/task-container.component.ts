import { Component, computed, HostListener, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { TaskComponent } from '../task/task.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskOptionsComponent } from '../task-options/task-options.component';
import { TaskViewComponent } from '../task-view/task-view.component';

import { DropdownComponent } from '@shared/components/dropdown/dropdown';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';

import { TaskFacade } from '../../facades/task.facade';
import { ETaskSort } from '../../enums/task.enum';

import { SelectableOption } from '@shared/models/selectables.models';

import { TaskCreateRequest, TaskEditRequest } from '@features/tasks/models/task.models';

import { TaskUiState } from '../../states/task-ui.state';


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
    TaskViewComponent
  ],
  templateUrl: './task-container.component.html',
  styleUrl: './task-container.component.scss',
})
export class TaskContainerComponent {

  // =========================
  // Dependencies
  // =========================

  private readonly taskFacade = inject(TaskFacade);
  private readonly taskUiState = inject(TaskUiState);


  // =========================
  // Facade state
  // =========================

  readonly tasks = this.taskFacade.tasks;

  readonly pagedResponse = this.taskFacade.pagedResponse;

  readonly selectedTask = this.taskFacade.selectedTask;

  readonly selectedStatus = this.taskFacade.selectedStatus;

  readonly selectedPriority = this.taskFacade.selectedPriority;

  readonly currentPage = this.taskFacade.currentPage;

  readonly priorityFormOptions = this.taskFacade.priorityOptions;

  readonly statusFormOptions = this.taskFacade.statusOptions;


  // =========================
  // UI state
  // =========================

  readonly selectedTaskId = this.taskUiState.selectedTaskId;

  readonly selectedTaskPosition = this.taskUiState.selectedTaskPosition;

  readonly activeModal = this.taskUiState.activeModal;

  readonly isClosingTaskDetails = this.taskUiState.isClosingTaskDetails;

  // =========================
  // Form controls
  // =========================

  readonly allTasksControl = new FormControl(false, {
    nonNullable: true
  });

  readonly searchControl = new FormControl('', {
    nonNullable: true
  });

  readonly pageInput = new FormControl<number | null>(null);


  // =========================
  // Selectables / Filters
  // =========================

  readonly statusOptions = computed<SelectableOption[]>(() => [
    { id: null, name: 'Todos os status' },
    ...this.taskFacade.statusOptions()
  ]);

  readonly priorityOptions = computed<SelectableOption[]>(() => [
    { id: null, name: 'Todas as prioridades' },
    ...this.taskFacade.priorityOptions()
  ]);


  // =========================
  // Derived state
  // =========================

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


  // =========================
  // Constants
  // =========================

  readonly TaskSort = ETaskSort;


  // =========================
  // Lifecycle
  // =========================

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


  // =========================
  // Filters
  // =========================

  selectStatus(status: SelectableOption): void {
    this.taskFacade.selectStatus(status);
  }

  selectPriority(priority: SelectableOption): void {
    this.taskFacade.selectPriority(priority);
  }


  // =========================
  // Sorting
  // =========================

  orderTasks(sort: string): void {
    this.taskFacade.orderTasks(sort);
  }


  // =========================
  // Pagination
  // =========================

  changePage(page: number | null): void {
    const totalPages = this.pagedResponse()?.totalPages ?? 0;

    if (page === null || page < 1 || page > totalPages) {
      return;
    }

    this.taskFacade.changePage(page);
  }

  goToPage(input: HTMLInputElement): void {
    input.blur();

    this.changePage(this.pageInput.value);
  }


  // =========================
  // Task actions
  // =========================

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
    const taskId = this.selectedTaskId();

    if (!taskId) {
      return;
    }

    this.taskFacade.deleteTask(taskId);

    this.closeModal();
  }


  // =========================
  // Task form
  // =========================

  openTaskForm(mode: 'create' | 'edit'): void {
    if (mode === 'edit') {
      const taskId = this.selectedTaskId();

      if (!taskId) {
        return;
      }

      this.taskFacade.getTaskById(taskId);
    }
    else {
      this.taskFacade.clearSelectedTask();
    }

    this.taskUiState.openModal(mode);
    this.taskUiState.closeTaskOptions();
  }


  // =========================
  // Task details
  // =========================

  openTaskDetails(): void {
    const taskId = this.selectedTaskId();

    if (!taskId) {
      return;
    }

    this.taskFacade.getTaskById(taskId);

    this.taskUiState.openModal('view');
    this.taskUiState.closeTaskOptions();
  }

  openTaskDetailsById(taskId: string): void {
    this.taskUiState.selectTask(taskId);
    this.openTaskDetails();
  }

  closeTaskDetails(): void {
    this.taskUiState.startClosingTaskDetails();

    setTimeout(() => {
      this.taskUiState.closeModal();
      this.taskUiState.finishClosingTaskDetails();
    }, 250);
  }

  // =========================
  // Task options menu
  // =========================

  openTaskOptions(taskId: string, element: HTMLElement): void {
    const wrapper = element.closest('.tasks-wrapper') as HTMLElement | null;

    if (!wrapper) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    this.taskUiState.selectTask(taskId);

    this.taskUiState.setTaskOptionsPosition({
      top: rect.bottom - wrapperRect.top - 30,
      right: wrapperRect.right - rect.right + 20
    });
  }

  closeTaskOptions(): void {
    this.taskUiState.closeTaskOptions();
  }


  // =========================
  // Modal
  // =========================

  closeModal(): void {
    this.taskUiState.closeModal();
  }

  openDeleteConfirmation(): void {
    if (!this.selectedTaskId()) {
      return;
    }

    this.taskUiState.openModal('delete');
    this.taskUiState.closeTaskOptions();
  }


  // =========================
  // Document events
  // =========================

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeTaskOptions();
  }
}