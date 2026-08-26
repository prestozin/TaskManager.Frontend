import { Component, inject, input, signal } from '@angular/core';
import { TaskComponent } from "../task/task";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskResponse } from '../../types/task/task-response';
import { TaskService } from '../../services/task/task.service';
import { ETaskStatus } from '../../enums/ETaskStatus';
import { TaskPagedParams } from '../../types/task/task-paged-params';
import { ETaskSort } from '../../enums/ETaskSort';

@Component({
  selector: 'app-task-container',
  imports: [
    TaskComponent,
    ReactiveFormsModule
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

  pages: number[] = [];

  currentPage: number = 1;

  pageInput = new FormControl<number | null>(null);

  ngOnInit() {
    this.getTasks()
  }

  private getTasks() {

    this.taskService.getPaged(this.pagedParams).subscribe({

      next: (response) => {

        const totalCount = response.data.totalCount;
        const pageSize = this.pagedParams.pageSize;
        const totalPages = Math.ceil(totalCount / pageSize);

        this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        this.tasks.set(response.data.items);

      },
      error: (error) => {
        console.error('erro ao buscar tarefas:', error)
        this.tasks.set([]);
      }

    });
  }

  filterTasks(filter: ETaskStatus | null) {

    this.pagedParams.taskStatusId = filter;
    this.pagedParams.pageNumber = this.currentPage;

    this.getTasks();
  }

  orderTasks(sort: string) {
    this.pagedParams.order = this.pagedParams.order === "asc" ? "desc" : "asc";
    this.pagedParams.sort = sort;
    this.getTasks();
  }
  changePage(page: number | null) {

    if (page === null || page < 1 || page > this.pages.length) 
        return;

    this.currentPage = page;
    this.pagedParams.pageNumber = page;

    this.getTasks();

    console.log(this.currentPage)
  }

}
