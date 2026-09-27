import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskViewComponent } from './task-view.component';

describe('TaskViewComponent', () => {
  let component: TaskViewComponent;
  let fixture: ComponentFixture<TaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskViewComponent]
    })
      .overrideComponent(TaskViewComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(TaskViewComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('task', {
      id: 'task-1',
      title: 'mINHA TAREFA',
      description: 'dESCRIÇÃO',
      createdAt: '2026-09-27T00:00:00Z',
      status: 'Em Progrésso',
      priority: 'Alta'
    });

    fixture.detectChanges();
  });

  it('ShouldFormatTaskValues_WhenTaskIsProvided', () => {
    expect(component.title()).toBe('Minha tarefa');
    expect(component.description()).toBe('Descrição');
    expect(component.status()).toBe('Em progrésso');
    expect(component.priority()).toBe('Alta');
  });

  it('ShouldBuildCssClasses_WhenTaskIsProvided', () => {
    expect(component.statusClass()).toBe('status-em-progresso');
    expect(component.priorityClass()).toBe('priority-alta');
  });

  it('ShouldEmitActions_WhenOutputsAreTriggered', () => {
    const edit = vi.fn();
    const remove = vi.fn();
    const close = vi.fn();

    component.editTaskClicked.subscribe(edit);
    component.deleteTaskClicked.subscribe(remove);
    component.closeClicked.subscribe(close);

    component.editTaskClicked.emit();
    component.deleteTaskClicked.emit();
    component.closeClicked.emit();

    expect(edit).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });
});
