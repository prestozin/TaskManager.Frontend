import { Component } from '@angular/core';
import { MainLayoutComponent } from '../../components/main-layout/main-layout';

@Component({
  selector: 'app-settings',
  imports: [
    MainLayoutComponent
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {}
