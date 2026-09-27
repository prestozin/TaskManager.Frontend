import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ETaskFormMode } from '../../enums/task.enum';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  const statuses = [
    { id: 1, name: 'Pendente' },
    { id: 2, name: 'Em Progresso' }
  ];

  const priorities = [
    { id: 1, name: 'Baixa' },
    { id: 3, name: 'Alta' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent]
    })
      .overrideComponent(TaskFormComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('statusOptions', statuses);
    fixture.componentRef.setInput('priorityOptions', priorities);
  });

  it('ShouldSelectFirstOptions_WhenCreateModeInitializes', () => {
    fixture.detectChanges();

    expect(component.selectedStatus()).toEqual(statuses[0]);
    expect(component.selectedPriority()).toEqual(priorities[0]);
    expect(component.formTitle()).toBe('Adicionar nova tarefa');
  });

  it('ShouldPopulateFormAndSelections_WhenEditModeInitializes', () => {
    fixture.componentRef.setInput('mode', ETaskFormMode.Edit);
    fixture.componentRef.setInput('task', {
      id: 'task-1',
      title: 'Existing task',
      description: null,
      createdAt: '2026-09-27T00:00:00Z',
      status: 'Em Progresso',
      priority: 'Alta'
    });

    fixture.detectChanges();

    expect(component.taskForm.getRawValue()).toEqual({
      title: 'Existing task',
      description: ''
    });
    expect(component.selectedStatus()).toEqual(statuses[1]);
    expect(component.selectedPriority()).toEqual(priorities[1]);
    expect(component.submitText()).toBe('Salvar alterações');
  });

  it('ShouldNotEmit_WhenFormIsInvalid', () => {
    fixture.detectChanges();
    const emitted = vi.fn();

    component.submitClicked.subscribe(emitted);
    component.submitTask();

    expect(emitted).not.toHaveBeenCalled();
    expect(component.taskForm.controls.title.touched).toBe(true);
  });

  it('ShouldEmitTrimmedCreateRequest_WhenCreateFormIsValid', () => {
    fixture.detectChanges();
    const emitted = vi.fn();

    component.submitClicked.subscribe(emitted);
    component.taskForm.setValue({
      title: '  New task  ',
      description: '   '
    });

    component.submitTask();

    expect(emitted).toHaveBeenCalledWith({
      title: 'New task',
      description: null,
      statusId: 1,
      priorityId: 1
    });
  });

  it('ShouldEmitEditRequest_WhenEditFormIsValid', () => {
    fixture.componentRef.setInput('mode', ETaskFormMode.Edit);
    fixture.componentRef.setInput('task', {
      id: 'task-1',
      title: 'Existing task',
      description: 'Description',
      createdAt: '2026-09-27T00:00:00Z',
      status: 'Pendente',
      priority: 'Baixa'
    });

    fixture.detectChanges();

    const emitted = vi.fn();
    component.submitClicked.subscribe(emitted);

    component.taskForm.setValue({
      title: 'Updated task',
      description: 'Updated'
    });

    component.submitTask();

    expect(emitted).toHaveBeenCalledWith({
      id: 'task-1',
      title: 'Updated task',
      description: 'Updated',
      statusId: 1,
      priorityId: 1
    });
  });

  it('ShouldUpdateSelection_WhenExistingOptionIdIsSelected', () => {
    fixture.detectChanges();

    component.selectStatusById(2);
    component.selectPriorityById(3);

    expect(component.selectedStatus()).toEqual(statuses[1]);
    expect(component.selectedPriority()).toEqual(priorities[1]);
  });

  it('ShouldEmitCancel_WhenCancelSubmitIsCalled', () => {
    fixture.detectChanges();
    const emitted = vi.fn();

    component.cancelClicked.subscribe(emitted);
    component.cancelSubmit();

    expect(emitted).toHaveBeenCalled();
  });
});
