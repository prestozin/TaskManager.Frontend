import { Component } from '@angular/core';
import { MainLayoutComponent } from '../../components/main-layout/main-layout';
import { NewTaskComponent } from '../../components/new-task/new-task.component';

@Component({
  selector: 'app-profile',
  imports: [
    MainLayoutComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {}
