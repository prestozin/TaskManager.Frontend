import { Component, inject } from '@angular/core';
import { MainLayoutComponent } from '../../components/main-layout/main-layout';
import { TaskContainerComponent } from "../../components/task-container/task-container";

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
