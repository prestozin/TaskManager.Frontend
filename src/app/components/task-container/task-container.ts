import { Component, computed, inject, output, signal } from '@angular/core';
import { TaskComponent } from "../task/task";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ETaskSort } from '../../enums/ETaskSort';
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

  private taskFacade = inject(TaskFacade);

  tasks = this.taskFacade.tasks;
  pagedResponse = this.taskFacade.pagedResponse;

  statusOptions = this.taskFacade.statusOptions;
  priorityOptions = this.taskFacade.priorityOptions;

  selectedStatus = this.taskFacade.selectedStatus;
  selectedPriority = this.taskFacade.selectedPriority;

  currentPage = this.taskFacade.currentPage;

  TaskSort = ETaskSort;

  newTaskClicked = output();

  allTasksControl = new FormControl(false, { nonNullable: true});

  searchControl = new FormControl('', { nonNullable: true });

  pageInput = new FormControl<number | null>(null);

  visiblePages = computed(() => {
    const totalPages = this.pagedResponse()?.totalPages ?? 0;
    const currentPage = this.currentPage();

    if (totalPages === 0) { 
      return []; 
    }

    if (totalPages <= 3) { 
      return Array.from( { length: totalPages }, (_, index) => index + 1 );
    }

    if (currentPage === 1) {
      return [1, 2, 3];
    }

    if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages ];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
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

    this.taskFacade.changePage(page);
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
