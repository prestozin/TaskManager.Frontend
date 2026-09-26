import { Component, input, output } from '@angular/core';

import { NzIconModule } from 'ng-zorro-antd/icon';

import { TaskOptionsPosition } from '@features/tasks/models/task.models';

@Component({
    selector: 'app-task-options',
    imports: [
        NzIconModule
    ],
    templateUrl: './task-options.component.html',
    styleUrl: './task-options.component.scss'
})
export class TaskOptionsComponent {

    readonly position = input.required<TaskOptionsPosition>();

    readonly deleteTaskClicked = output<void>();
    readonly editTaskClicked = output<void>();
    readonly viewTaskClicked = output<void>();
}
