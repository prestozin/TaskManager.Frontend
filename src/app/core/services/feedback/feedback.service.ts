import { Injectable, signal } from '@angular/core';

export type FeedbackType = 'success' | 'error' | 'warning' | 'alert';

@Injectable({
    providedIn: 'root'
})


export class FeedbackService {

    messageTitle = signal<string | null>(null);
    messageDescription = signal<string | null>(null);
    messageType = signal<FeedbackType | null>(null);

    isClosing = signal(false);

    showMessage(message: string, description: string, type: FeedbackType): void {
        this.messageTitle.set(message);
        this.messageDescription.set(description);
        this.messageType.set(type);

        setTimeout(() => {
            this.closeMessage();
        }, 5000);
    }

    closeMessage(): void {
        this.isClosing.set(true);

        setTimeout(() => {
            this.clearMessage();
            this.isClosing.set(false);
        }, 300);
    }

    clearMessage(): void {
        this.messageTitle.set(null);
        this.messageDescription.set(null);
        this.messageType.set(null);
    }
}
