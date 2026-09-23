import { inject, Injectable } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';

export type FeedbackType = 'success' | 'error' | 'warning' | 'alert';

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {

    private readonly notification = inject(NzNotificationService);

    showMessage(message: string, description: string, type: FeedbackType): void {
        switch (type) {
            case 'success':
                this.notification.success(message, description, { nzDuration: 5000 });
                break;

            case 'error':
                this.notification.error(message, description, { nzDuration: 5000 });
                break;

            case 'warning':
                this.notification.warning(message, description, { nzDuration: 5000 });
                break;

            case 'alert':
                this.notification.info(message, description, { nzDuration: 5000 });
                break;
        }
    }
}