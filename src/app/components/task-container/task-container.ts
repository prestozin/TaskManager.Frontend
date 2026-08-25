import { Component, inject, signal } from '@angular/core';
import { TaskComponent } from "../task/task";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskResponse } from '../../types/task/task-response';
import { TaskService } from '../../services/task/task.service';
import { ETaskStatus } from '../../enums/ETaskStatus';
import { TaskPagedParams } from '../../types/task/task-paged-params';

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

  tasks = signal<TaskResponse[]>([]);

  pagedParams = new TaskPagedParams();


  ngOnInit() {
    this.getTasks()
  }

  private getTasks() {

    this.taskService.getPaged(this.pagedParams).subscribe({

      next: (response) => {
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
    this.pagedParams.pageNumber = 1;

    this.getTasks();
  }

}
