import { Component, input } from '@angular/core';
import { TaskContainerComponent } from "../task-container/task-container";

@Component({
  selector: 'app-main-layout',
  imports: [
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent {
  title = input('');
  username = input('');

}
