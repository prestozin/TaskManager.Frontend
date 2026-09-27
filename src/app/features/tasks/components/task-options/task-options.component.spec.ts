import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOptionsComponent } from './task-options.component';

describe('TaskOptionsComponent', () => {
  let component: TaskOptionsComponent;
  let fixture: ComponentFixture<TaskOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskOptionsComponent]
    })
      .overrideComponent(TaskOptionsComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(TaskOptionsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('position', { top: 10, right: 20 });
    fixture.detectChanges();
  });

  it('ShouldExposePosition_WhenPositionIsProvided', () => {
    expect(component.position()).toEqual({ top: 10, right: 20 });
  });

  it('ShouldEmitDelete_WhenDeleteOutputIsTriggered', () => {
    const emitted = vi.fn();
    component.deleteTaskClicked.subscribe(emitted);

    component.deleteTaskClicked.emit();

    expect(emitted).toHaveBeenCalled();
  });

  it('ShouldEmitEdit_WhenEditOutputIsTriggered', () => {
    const emitted = vi.fn();
    component.editTaskClicked.subscribe(emitted);

    component.editTaskClicked.emit();

    expect(emitted).toHaveBeenCalled();
  });

  it('ShouldEmitView_WhenViewOutputIsTriggered', () => {
    const emitted = vi.fn();
    component.viewTaskClicked.subscribe(emitted);

    component.viewTaskClicked.emit();

    expect(emitted).toHaveBeenCalled();
  });
});
