import { Component, inject } from '@angular/core';
import { MainLayoutComponent } from '../../components/main-layout/main-layout';
import { TaskContainerComponent } from "../../components/task-container/task-container";
import { NewTaskComponent } from "../../components/new-task/new-task.component";

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
  

}
