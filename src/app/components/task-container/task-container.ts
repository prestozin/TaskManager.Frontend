import { Component, inject } from '@angular/core';
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

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  tasks: TaskResponse[] = [];
  visibleTasks: TaskResponse[] = [];

  ngOnInit() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => { 
        this.tasks = tasks; this.updateVisibleTasks(); 
      },

      error: (error) => { 
        console.error('erro ao buscar tarefas:', error); 
      }
    })
  }

  private updateVisibleTasks() {

    this.visibleTasks = this.tasks.slice(0, 10);

  }
}
