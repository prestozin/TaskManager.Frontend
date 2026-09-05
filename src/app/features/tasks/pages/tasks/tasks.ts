import { Component } from '@angular/core';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout';

@Component({
  selector: 'app-tasks',
  imports: [
    MainLayoutComponent
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {}
