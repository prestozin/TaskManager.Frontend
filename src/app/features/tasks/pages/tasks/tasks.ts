import { Component } from '@angular/core';
import { TaskContainerComponent } from '@features/tasks/components/task-container/task-container.component';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout';

@Component({
  selector: 'app-tasks',
  imports: [
    MainLayoutComponent,
    TaskContainerComponent
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks { }
