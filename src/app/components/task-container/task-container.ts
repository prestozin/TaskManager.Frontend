import { Component, computed, inject, output, signal } from '@angular/core';
import { TaskComponent } from "../task/task";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskResponse } from '../../types/task/task-response';
import { TaskService } from '../../services/task/task.service';
import { ETaskStatus } from '../../enums/ETaskStatus';
import { TaskPagedParams } from '../../types/task/task-paged-params';
import { ETaskSort } from '../../enums/ETaskSort';
import { PagedResponse } from '../../types/task/paged-response';
import { DropdownComponent, DropdownOption } from "../dropdown/dropdown";

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

  TaskStatus = ETaskStatus;
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

  priorities = [{ id: 1, name: 'Baixa' },
  { id: 2, name: 'Média' },
  { id: 3, name: 'Alta' }
  ];

  selectedPriority = this.priorities[2];

  status = [{ id: 1, name: 'pendente' },
  { id: 2, name: 'em progresso' },
  { id: 3, name: 'concluida' }
  ];

  selectedStatus = this.status[2];




  ngOnInit() {
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

  filterTasks(filter: ETaskStatus | null) {

    this.pagedParams.taskStatusId = filter;
    this.pagedParams.pageNumber = 1;

    this.getTasks();
  }

  orderTasks(sort: string) {
    this.pagedParams.order = this.pagedParams.order === "asc" ? "desc" : "asc";
    this.pagedParams.sort = sort;
    this.getTasks();
  }

  changePage(page: number | null) {

    const totalPages = this.pagedResponse()?.totalPages ?? 0;

    if (page === null || page < 1 || page > totalPages)
      return;

    this.pagedParams.pageNumber = page;

    this.getTasks();
  }

  goToPage(input: HTMLInputElement) {
    const page = this.pageInput.value;

    input.blur();  //remove o foco do input

    this.changePage(page);
  }

  openNewTask() {
    this.newTaskClicked.emit();
  }

  selectPriority(priority: DropdownOption): void {
    this.selectedPriority = priority;
  }

  selectStatus(status: DropdownOption): void {
    this.selectedStatus = status;
  }
}
