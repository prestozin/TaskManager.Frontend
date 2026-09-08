import { Component, computed, HostListener, inject, output, signal } from '@angular/core';
import { TaskComponent } from "../task/task.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ETaskSort } from '../../enums/ETaskSort';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown';
import { TaskFacade } from '../../facades/task.facade';
import { SelectableOption } from '../../../../shared/models/selectables.models';
import { NewTaskComponent } from '../new-task/new-task.component';
import { TaskCreateRequest } from '@features/tasks/models/task.models';
import { TaskOptionsComponent } from '../task-options/task-options.component';



@Component({
  selector: 'app-task-container',
  imports: [
    TaskComponent,
    ReactiveFormsModule,
    DropdownComponent,
    NewTaskComponent,
    TaskOptionsComponent
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

  selectedStatus = this.taskFacade.selectedStatus;
  selectedPriority = this.taskFacade.selectedPriority;
  selectedTask = signal<string | null>(null);
  selectedTaskPosition = signal<{ top: number; right: number; } | null>(null);

  currentPage = this.taskFacade.currentPage;

  TaskSort = ETaskSort;

  newTaskClicked = output();

  allTasksControl = new FormControl(false, { nonNullable: true });

  searchControl = new FormControl('', { nonNullable: true });

  pageInput = new FormControl<number | null>(null);

  isNewTaskOpen = false;

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

  addTask(request: TaskCreateRequest): void {
    this.taskFacade.addTask(request);
    this.closeNewTask();
  }

  deleteTask(taskId: string): void {
    this.taskFacade.deleteTask(taskId);
  }
  
  openNewTask(): void {
    this.isNewTaskOpen = true;
  }

  closeNewTask(): void {
    console.log('close task clicked')
    this.isNewTaskOpen = false;
  }

  openTaskOptions(taskId: string, element: HTMLElement): void {
    const rect = element.getBoundingClientRect();  //pega as dimensões e posição do elemento clicado
    const wrapper = element.closest('.tasks-wrapper') as HTMLElement; //pega o elemento pai mais próximo com a classe 'tasks-wrapper'
    const wrapperRect = wrapper.getBoundingClientRect(); //pega as dimensões e posição do elemento pai

    this.selectedTask.set(taskId);

    this.selectedTaskPosition.set({
      top: rect.bottom - wrapperRect.top + -30, 
      right: wrapperRect.right - rect.right + 20 
    });

    console.log(taskId);
    console.log(rect);
  }

  closeTaskOptions(): void {
    this.selectedTask.set(null);
    this.selectedTaskPosition.set(null);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeTaskOptions();
  }
}
