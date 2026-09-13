import { Component, input, output } from '@angular/core';
import { LucideEye, LucidePencil, LucideTrash } from '@lucide/angular';

@Component({
    selector: 'app-task-options',
    templateUrl: './task-options.component.html',
    styleUrl: './task-options.component.scss',
    imports: [
        LucideEye,
        LucidePencil,
        LucideTrash
    ]
})

export class TaskOptionsComponent {

  position = input.required<{ top: number; right: number; }>();
  
  deleteTaskClicked = output<void>();
  editTaskClicked = output<void>();
  viewTaskClicked = output<void>();
  closeClicked = output<void>();
}