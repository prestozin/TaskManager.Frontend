import { TestBed } from '@angular/core/testing';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import { EFeedbackType } from '@shared/enums/feedback.enum';

import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let notification: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    warning: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    notification = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        FeedbackService,
        { provide: NzNotificationService, useValue: notification }
      ]
    });

    service = TestBed.inject(FeedbackService);
  });

  it('ShouldShowSuccessNotification_WhenTypeIsSuccess', () => {
    service.showMessage('Message', 'Description', EFeedbackType.Success);

    expect(notification.success).toHaveBeenCalledWith(
      'Message',
      'Description',
      { nzDuration: 5000 }
    );
  });

  it('ShouldShowErrorNotification_WhenTypeIsError', () => {
    service.showMessage('Message', 'Description', EFeedbackType.Error);

    expect(notification.error).toHaveBeenCalled();
  });

  it('ShouldShowWarningNotification_WhenTypeIsWarning', () => {
    service.showMessage('Message', 'Description', EFeedbackType.Warning);

    expect(notification.warning).toHaveBeenCalled();
  });

  it('ShouldShowInfoNotification_WhenTypeIsInfo', () => {
    service.showMessage('Message', 'Description', EFeedbackType.Info);

    expect(notification.info).toHaveBeenCalled();
  });
});
