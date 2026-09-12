import { Injectable, signal } from '@angular/core';
import { TaskModal, TaskOptionsPosition } from '@features/tasks/models/task-ui-state.models';


@Injectable()
export class TaskUiState {

    private readonly _selectedTaskId = signal<string | null>(null);

    readonly selectedTaskId = this._selectedTaskId.asReadonly();

    private readonly _selectedTaskPosition = signal<TaskOptionsPosition | null>(null);

    readonly selectedTaskPosition = this._selectedTaskPosition.asReadonly();

    private readonly _activeModal = signal<TaskModal>(null);

    readonly activeModal = this._activeModal.asReadonly();

    private readonly _isClosingTaskDetails = signal(false);

    readonly isClosingTaskDetails = this._isClosingTaskDetails.asReadonly();


    selectTask(taskId: string): void {
        this._selectedTaskId.set(taskId);
    }

    setTaskOptionsPosition(position: TaskOptionsPosition): void {
        this._selectedTaskPosition.set(position);
    }

    closeTaskOptions(): void {
        this._selectedTaskPosition.set(null);
    }

    openModal(modal: TaskModal): void {
        this._activeModal.set(modal);
    }

    closeModal(): void {
        this._activeModal.set(null);
    }

    startClosingTaskDetails(): void {
        this._isClosingTaskDetails.set(true);
    }

    finishClosingTaskDetails(): void {
        this._isClosingTaskDetails.set(false);
    }
}