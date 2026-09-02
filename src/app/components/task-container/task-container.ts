import { Component, computed, inject, output, signal } from '@angular/core';
import { TaskComponent } from "../task/task";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskResponse } from '../../types/task/task-response';
import { TaskService } from '../../services/task/task.service';
import { TaskPagedParams } from '../../types/task/task-paged-params';
import { ETaskSort } from '../../enums/ETaskSort';
import { PagedResponse } from '../../types/task/paged-response';
import { DropdownComponent } from "../dropdown/dropdown";
import { SelectableOption } from '../../interfaces/selectable-option';

@Component({
  selector: 'app-task-container',
  imports: [
    TaskComponent,
    ReactiveFormsModule,
    DropdownComponent,
  ],
  templateUrl: './task-container.html',
  styleUrl: './task-container.scss',
})

export class TaskContainerComponent {

  private taskService = inject(TaskService);

  allTasksForm = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    completed: new FormControl(false, { nonNullable: true })
  });

  searchControl = new FormControl('', { nonNullable: true });

  TaskSort = ETaskSort;

  tasks = signal<TaskResponse[]>([]);

  pagedParams = new TaskPagedParams();

  pagedResponse = signal<PagedResponse | null>(null);

  pageInput = new FormControl<number | null>(null);

  newTaskClicked = output();

  visiblePages = computed(() => {
    const totalPages = this.pagedResponse()?.totalPages ?? 0;

    if (totalPages === 0) {
      return [];
    }

    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (this.pagedParams.pageNumber === 1) {
      return [1, 2, 3];
    }

    if (this.pagedParams.pageNumber === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [this.pagedParams.pageNumber - 1, this.pagedParams.pageNumber, this.pagedParams.pageNumber + 1];
  });

  statusOptions: SelectableOption[] = [];
  priorityOptions: SelectableOption[] = [];

  selectedStatus: SelectableOption = {
    id: null,
    name: 'Todos os status'
  };

  selectedPriority: SelectableOption = {
    id: null,
    name: 'Todas as prioridades'
  };

  ngOnInit() {
    this.loadSelectables();
    this.getTasks()
  }

  private getTasks() {

    this.taskService.getPaged(this.pagedParams).subscribe({

      next: (response) => {

        this.pagedResponse.set(response.data);
        this.tasks.set(response.data.items);

      },
      error: (error) => {
        console.error('erro ao buscar tarefas:', error)
        this.tasks.set([]);
        this.pagedResponse.set(null);

      }

    });
  }

  orderTasks(sort: string): void {
    this.pagedParams.order = this.pagedParams.order === "asc" ? "desc" : "asc";
    this.pagedParams.sort = sort;
    this.getTasks();
  }

  changePage(page: number | null): void {

    const totalPages = this.pagedResponse()?.totalPages ?? 0;

    if (page === null || page < 1 || page > totalPages)
      return;

    this.pagedParams.pageNumber = page;

    this.getTasks();
  }

  goToPage(input: HTMLInputElement): void {
    const page = this.pageInput.value;

    input.blur();  //remove o foco do input

    this.changePage(page);
  }

  openNewTask(): void {
    this.newTaskClicked.emit();
  }

  loadSelectables(): void {
    this.taskService.getSelectables().subscribe({
      next: (response) => {
        this.statusOptions = [
          { id: null, name: 'Todos os status' },
          ...response.data.status
        ];

        this.priorityOptions = [
          { id: null, name: 'Todas as prioridades' },
          ...response.data.priority
        ];
      },
      error: (error) => {
        console.error('Erro ao buscar opções de status e prioridade:', error);
      }
    });
  }

  private applyFilters(): void {
    this.pagedParams.pageNumber = 1;
    this.getTasks();
  }

  selectPriority(priority: SelectableOption): void {
     console.log('Prioridade selecionada:', priority);

  this.selectedPriority = priority;
  this.pagedParams.taskPriorityId = priority.id;

  console.log('Paged params:', this.pagedParams);
    this.applyFilters();
  }

  selectStatus(status: SelectableOption): void {
    this.selectedStatus = status;
    this.pagedParams.taskStatusId = status.id;
    this.applyFilters();
  }
}
