import { inject, Injectable } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import { EFeedbackType } from '@shared/enums/feedback.enum';

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {

    private readonly notification = inject(NzNotificationService);
    private readonly notificationDuration = 3000;

    showMessage(message: string, description: string, type: EFeedbackType): void {
        switch (type) {
            case EFeedbackType.Success:
                this.notification.success(message, description, { nzDuration: this.notificationDuration });
                break;

            case EFeedbackType.Error:
                this.notification.error(message, description, { nzDuration: this.notificationDuration });
                break;

            case EFeedbackType.Warning:
                this.notification.warning(message, description, { nzDuration: this.notificationDuration });
                break;

            case EFeedbackType.Info:
                this.notification.info(message, description, { nzDuration: this.notificationDuration });
                break;
        }
    }
}
