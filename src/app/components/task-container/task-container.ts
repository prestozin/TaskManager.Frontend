import { Component, inject, signal } from '@angular/core';
import { TaskComponent } from "../task/task";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskResponse } from '../../types/task/task-response';
import { TaskService } from '../../services/task/task.service';

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

  activeFilter = 'all';

  tasks = signal<TaskResponse[]>([]);
  visibleTasks = signal<TaskResponse[]>([]);

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  ngOnInit() {
    console.log('TASK CONTAINER FOI INICIALIZADO');
    this.taskService.getTasks().subscribe({
      next: (response) => {

        console.log('GET TASKS EXECUTADO');

        this.tasks.set(response.data.items);

        this.updateVisibleTasks();

      },

      error: (error) => {
        console.error('erro ao buscar tarefas:', error);
      }
    })
  }

  private updateVisibleTasks() {

    this.visibleTasks.set(this.tasks().slice(0, 10));

  }
}
