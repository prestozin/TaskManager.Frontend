import { Component, inject } from '@angular/core';
import { NewTaskComponent } from '@features/tasks/components/new-task/new-task.component';
import { TaskContainerComponent } from '@features/tasks/components/task-container/task-container.component';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout';


@Component({
  selector: 'app-dashboard',
  imports: [
    MainLayoutComponent,
    TaskContainerComponent,
    NewTaskComponent
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  
  isNewTaskOpen = false;

  openNewTask() {
    this.isNewTaskOpen = true;
  }

  closeNewTask() {
    console.log('close task clicked')
    this.isNewTaskOpen = false;
  }
}
