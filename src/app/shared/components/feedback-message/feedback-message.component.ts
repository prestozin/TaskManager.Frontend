import { Component, inject } from '@angular/core';
import { FeedbackService } from '@core/services/feedback/feedback.service';


@Component({
  selector: 'app-feedback-message',
  imports: [],
  templateUrl: './feedback-message.component.html',
  styleUrl: './feedback-message.component.scss',
})
export class FeedbackMessageComponent {

  feedbackService = inject(FeedbackService)

}
