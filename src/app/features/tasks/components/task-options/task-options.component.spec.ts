import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOptionsComponent } from './task-options.component';

describe('TaskOptions', () => {
  let component: TaskOptionsComponent;
  let fixture: ComponentFixture<TaskOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskOptionsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
