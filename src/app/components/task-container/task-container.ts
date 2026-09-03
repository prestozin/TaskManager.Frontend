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
import { TaskFacade } from '../../facades/task.facade';

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
  private taskFacade = inject(TaskFacade);

  allTasksForm = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    completed: new FormControl(false, { nonNullable: true })
  });

  tasks = this.taskFacade.tasks;
  pagedResponse = this.taskFacade.pagedResponse;

  statusOptions = this.taskFacade.statusOptions;
  priorityOptions = this.taskFacade.priorityOptions;

  selectedStatus = this.taskFacade.selectedStatus;
  selectedPriority = this.taskFacade.selectedPriority;

  searchControl = new FormControl('', { nonNullable: true });

  TaskSort = ETaskSort;

  pagedParams = new TaskPagedParams();

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


  ngOnInit() {
    this.taskFacade.loadSelectables();
    this.taskFacade.loadTasks();
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

    this.pagedParams.pageNumber = page;

    this.taskFacade.loadTasks();
  }

  goToPage(input: HTMLInputElement): void {
    const page = this.pageInput.value;

    input.blur();  //remove o foco do input

    this.changePage(page);
  }

  createNewTask(): void {
    this.newTaskClicked.emit();
  }
}
