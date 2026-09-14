import { Injectable, signal } from '@angular/core';

import {
    TaskModal,
    TaskOptionsPosition
} from '@features/tasks/models/task-ui-state.models';

@Injectable()
export class TaskUiState {

    readonly activeTaskId = signal<string | null>(null);
    readonly checkedTaskIds = signal<Set<string>>(new Set());

    readonly selectedTaskPosition = signal<TaskOptionsPosition | null>(null);

    readonly activeModal = signal<TaskModal>(null);
    readonly isClosingTaskDetails = signal(false);


    setActiveTask(taskId: string): void {
        this.activeTaskId.set(taskId);
    }

    toggleCheckedTask(taskId: string): void {
        const checkedTaskIds = new Set(this.checkedTaskIds());

        if (checkedTaskIds.has(taskId)) {
            checkedTaskIds.delete(taskId);
        }
        else {
            checkedTaskIds.add(taskId);
        }

        this.checkedTaskIds.set(checkedTaskIds);

        console.log(checkedTaskIds)
    }

    toggleAllCheckedTasks(taskIds: string[]): void {
        const allChecked = taskIds.every(taskId =>
            this.checkedTaskIds().has(taskId)
        );

        if (allChecked) {
            this.checkedTaskIds.set(new Set());
        }
        else {
            this.checkedTaskIds.set(new Set(taskIds));
        }
    }

    clearCheckedTasks(): void {
        this.checkedTaskIds.set(new Set());
    }

    setTaskOptionsPosition(position: TaskOptionsPosition): void {
        this.selectedTaskPosition.set(position);
    }

    closeTaskOptions(): void {
        this.selectedTaskPosition.set(null);
    }


    openModal(modal: TaskModal): void {
        this.activeModal.set(modal);
    }

    closeModal(): void {
        this.activeModal.set(null);
    }


    startClosingTaskDetails(): void {
        this.isClosingTaskDetails.set(true);
    }

    finishClosingTaskDetails(): void {
        this.isClosingTaskDetails.set(false);
    }
}