import { Component } from '@angular/core';
import { MainLayoutComponent } from '../../components/main-layout/main-layout';

@Component({
  selector: 'app-dashboard',
  imports: [
    MainLayoutComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
