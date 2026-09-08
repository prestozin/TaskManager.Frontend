import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackMessageComponent } from './feedback-message.component';

describe('FeedbackMessageComponent', () => {
  let component: FeedbackMessageComponent;
  let fixture: ComponentFixture<FeedbackMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackMessageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
