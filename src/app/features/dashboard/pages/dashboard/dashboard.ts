import { Component, inject } from '@angular/core';
import { TaskFormComponent } from '@features/tasks/components/task-form/task-form.component';
import { TaskContainerComponent } from '@features/tasks/components/task-container/task-container.component';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout';


@Component({
  selector: 'app-dashboard',
  imports: [
    MainLayoutComponent,
    TaskContainerComponent
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {

}
