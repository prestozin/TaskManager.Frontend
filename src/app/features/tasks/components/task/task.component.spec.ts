import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskComponent } from './task.component';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskComponent]
    })
      .overrideComponent(TaskComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('task', {
      id: 'task-1',
      title: 'mINHA TAREFA',
      description: 'descrição',
      createdAt: '2026-09-27T00:00:00Z',
      status: 'Em Progrésso',
      priority: 'Alta'
    });

    fixture.detectChanges();
  });

  it('ShouldFormatTaskTexts_WhenTaskIsProvided', () => {
    expect(component.title()).toBe('Minha tarefa');
    expect(component.description()).toBe('Descrição');
    expect(component.priority()).toBe('Alta');
    expect(component.status()).toBe('Em progrésso');
  });

  it('ShouldBuildCssClasses_WhenStatusAndPriorityAreProvided', () => {
    expect(component.priorityClass()).toBe('priority-alta');
    expect(component.statusClass()).toBe('status-em-progresso');
  });

  it('ShouldInvertVisibilityFlags_WhenInputsChange', () => {
    fixture.componentRef.setInput('showCheckbox', false);
    fixture.componentRef.setInput('showOptions', false);

    expect(component.withoutCheckbox()).toBe(true);
    expect(component.withoutOptions()).toBe(true);
  });
});
