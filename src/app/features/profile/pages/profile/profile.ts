import { Component } from '@angular/core';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout';


@Component({
  selector: 'app-profile',
  imports: [
    MainLayoutComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {}
