import { Component, computed, HostListener, inject, output, signal } from '@angular/core';
import { TaskComponent } from "../task/task.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ETaskSort } from '../../enums/ETaskSort';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown';
import { TaskFacade } from '../../facades/task.facade';
import { SelectableOption } from '../../../../shared/models/selectables.models';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskCreateRequest, TaskEditRequest, TaskResponse } from '@features/tasks/models/task.models';
import { TaskOptionsComponent } from '../task-options/task-options.component';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';



@Component({
  selector: 'app-task-container',
  imports: [
    TaskComponent,
    ReactiveFormsModule,
    DropdownComponent,
    TaskFormComponent,
    TaskOptionsComponent,
    ConfirmationModalComponent
  ],
  templateUrl: './task-container.component.html',
  styleUrl: './task-container.component.scss',
})

export class TaskContainerComponent {

  private taskFacade = inject(TaskFacade);

  tasks = this.taskFacade.tasks;
  pagedResponse = this.taskFacade.pagedResponse;

  statusOptions = computed<SelectableOption[]>(() => [
    { id: null, name: 'Todos os status' },
    ...this.taskFacade.statusOptions()
  ]);
  
  priorityOptions = computed<SelectableOption[]>(() => [
    { id: null, name: 'Todas as prioridades' },
    ...this.taskFacade.priorityOptions()
  ]);

  priorityFormOptions = this.taskFacade.priorityOptions;
  statusFormOptions = this.taskFacade.statusOptions;

  selectedStatus = this.taskFacade.selectedStatus;
  selectedPriority = this.taskFacade.selectedPriority;

  selectedTaskPosition = signal<{ top: number; right: number; } | null>(null);

  currentPage = this.taskFacade.currentPage;

  TaskSort = ETaskSort;

  newTaskClicked = output();

  allTasksControl = new FormControl(false, { nonNullable: true });

  searchControl = new FormControl('', { nonNullable: true });

  pageInput = new FormControl<number | null>(null);

  taskFormMode = signal<'create' | 'edit'>('create');
  isTaskFormOpen = signal(false);

  selectedTask = signal<TaskResponse | null>(null);

  isDeleteConfirmationOpen = signal(false);

  visiblePages = computed(() => {
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

  ngOnInit() {
    this.taskFacade.loadSelectables();
    this.taskFacade.getTasks();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged()) // aguarda 300ms após o usuário parar de digitar e evita repetir a busca quando o valor não muda
      .subscribe(search => { this.taskFacade.searchTasks(search); });
  }

  selectStatus(status: SelectableOption): void {
    this.taskFacade.selectStatus(status);
  }

  selectPriority(priority: SelectableOption): void {
    this.taskFacade.selectPriority(priority);
  }

  orderTasks(sort: string): void {
    this.taskFacade.orderTasks(sort);
  }

  changePage(page: number | null): void {

    const totalPages = this.pagedResponse()?.totalPages ?? 0;

    if (page === null || page < 1 || page > totalPages)
      return;

    this.taskFacade.changePage(page);
  }

  goToPage(input: HTMLInputElement): void {
    const page = this.pageInput.value;

    input.blur();  //remove o foco do input

    this.changePage(page);
  }

  saveTask(request: TaskCreateRequest | TaskEditRequest) {
    if (this.taskFormMode() === 'create') {
      this.addTask(request as TaskCreateRequest)
    }
    else {
      this.editTask(request as TaskEditRequest);
    }
  }

  addTask(request: TaskCreateRequest): void {
    this.taskFacade.addTask(request);
    this.closeTaskForm();
  }

  editTask(request: TaskEditRequest): void {
    this.taskFacade.editTask(request);
    this.closeTaskForm();
  }

  deleteTask(): void {
    const task = this.selectedTask();

    if (!task) return;

    this.taskFacade.deleteTask(task.id);

    this.selectedTask.set(null);
    this.closeDeleteConfirmation();
  }

  openTaskForm(mode: 'create' | 'edit'): void {
    if (mode === 'edit' && !this.selectedTask()) return;

    this.taskFormMode.set(mode);

    if (mode === 'create') {
      this.selectedTask.set(null);
    }

    this.isTaskFormOpen.set(true);
    this.closeTaskOptions();
  }

  closeTaskForm(): void {
    this.isTaskFormOpen.set(false);
  }

  openTaskOptions(task: TaskResponse, element: HTMLElement): void {
    const rect = element.getBoundingClientRect();  //pega as dimensões e posição do elemento clicado
    const wrapper = element.closest('.tasks-wrapper') as HTMLElement; //pega o elemento pai mais próximo com a classe 'tasks-wrapper'
    const wrapperRect = wrapper.getBoundingClientRect(); //pega as dimensões e posição do elemento pai

    this.selectedTask.set(task);

    this.selectedTaskPosition.set({
      top: rect.bottom - wrapperRect.top + -30,
      right: wrapperRect.right - rect.right + 20
    });
  }

  closeTaskOptions(): void {
    this.selectedTaskPosition.set(null);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeTaskOptions();
  }

  openDeleteConfirmation(): void {
    this.isDeleteConfirmationOpen.set(true);
  }

  closeDeleteConfirmation(): void {
    this.isDeleteConfirmationOpen.set(false);
  }
}
