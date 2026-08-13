import { Component, input } from '@angular/core';
import { TaskContainerComponent } from "../task-container/task-container";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterLink,
    RouterLinkActive
],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent {
  title = input('');
  username = input('');

}
