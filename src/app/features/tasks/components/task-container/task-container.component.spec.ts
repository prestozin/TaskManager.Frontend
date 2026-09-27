import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ETaskFilter, ETaskModal, ETaskSort } from '../../enums/task.enum';
import { TaskFacade } from '../../facades/task.facade';
import { TaskState } from '../../states/task.state';
import { TaskContainerComponent } from './task-container.component';

describe('TaskContainerComponent', () => {
  let component: TaskContainerComponent;
  let fixture: ComponentFixture<TaskContainerComponent>;
  let state: TaskState;
  let taskFacade: any;

  const task = {
    id: 'task-1',
    title: 'Task',
    description: null,
    createdAt: '2026-09-27T00:00:00Z',
    status: 'Pendente',
    priority: 'Alta'
  };

  beforeEach(async () => {
    state = new TaskState();

    taskFacade = {
      tasks: state.tasks,
      pagedResponse: state.pagedResponse,
      selectedTask: state.selectedTask,
      selectedStatus: state.selectedStatus,
      selectedPriority: state.selectedPriority,
      selectedStartDate: state.selectedStartDate,
      selectedEndDate: state.selectedEndDate,
      statusOptions: state.statusOptions,
      priorityOptions: state.priorityOptions,
      currentPage: state.currentPage,
      confirmBeforeDelete: state.confirmBeforeDelete,
      loadSelectables: vi.fn(),
      getTasks: vi.fn(),
      searchTasks: vi.fn(),
      selectPriority: vi.fn(),
      selectStatus: vi.fn(),
      selectStartDate: vi.fn(),
      selectEndDate: vi.fn(),
      clearFilters: vi.fn(),
      orderTasks: vi.fn(),
      changePage: vi.fn(),
      editTask: vi.fn(),
      addTask: vi.fn(),
      clearSelectedTask: vi.fn(),
      getTaskById: vi.fn(),
      deleteTask: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TaskContainerComponent],
      providers: [
        { provide: TaskFacade, useValue: taskFacade },
        { provide: TaskState, useValue: state }
      ]
    })
      .overrideComponent(TaskContainerComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(TaskContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ShouldLoadInitialData_WhenComponentInitializes', () => {
    expect(taskFacade.loadSelectables).toHaveBeenCalled();
    expect(taskFacade.getTasks).toHaveBeenCalled();
  });

  it('ShouldBuildFilterOptions_WhenSelectableOptionsExist', () => {
    state.setStatusOptions([{ id: 1, name: 'Pendente' }]);
    state.setPriorityOptions([{ id: 3, name: 'Alta' }]);

    expect(component.statusOptions()).toEqual([
      { id: ETaskFilter.All, name: 'Todos os status' },
      { id: 1, name: 'Pendente' }
    ]);

    expect(component.priorityOptions()).toEqual([
      { id: ETaskFilter.All, name: 'Todas as prioridades' },
      { id: 3, name: 'Alta' }
    ]);
  });

  it('ShouldCalculatePagination_WhenPagedResponseChanges', () => {
    state.setTasks({
      items: [task],
      pageNumber: 2,
      pageSize: 10,
      totalCount: 50,
      totalPages: 5
    });

    expect(component.totalTaskCount()).toBe(50);
    expect(component.totalPages()).toBe(5);
    expect(component.visiblePageButtons().map(item => item.page)).toEqual([1, 2, 3]);
    expect(component.isFirstPage()).toBe(false);
    expect(component.isLastPage()).toBe(false);
  });

  it('ShouldForwardSelectedFilters_WhenOptionIdsExist', () => {
    state.setStatusOptions([{ id: 2, name: 'Em Progresso' }]);
    state.setPriorityOptions([{ id: 3, name: 'Alta' }]);

    component.selectStatusById(2);
    component.selectPriorityById(3);

    expect(taskFacade.selectStatus).toHaveBeenCalledWith({ id: 2, name: 'Em Progresso' });
    expect(taskFacade.selectPriority).toHaveBeenCalledWith({ id: 3, name: 'Alta' });
  });

  it('ShouldForwardDates_WhenDatesAreSelected', () => {
    component.selectStartDate(new Date(2026, 8, 1));
    component.selectEndDate(new Date(2026, 8, 27));

    expect(taskFacade.selectStartDate).toHaveBeenCalledWith('2026-09-01');
    expect(taskFacade.selectEndDate).toHaveBeenCalledWith('2026-09-27');
  });

  it('ShouldChangePage_WhenPageIsWithinRange', () => {
    state.setTasks({
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 20,
      totalPages: 2
    });

    component.changePage(2);

    expect(taskFacade.changePage).toHaveBeenCalledWith(2);
  });

  it('ShouldNotChangePage_WhenPageIsOutsideRange', () => {
    state.setTasks({
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 20,
      totalPages: 2
    });

    component.changePage(3);

    expect(taskFacade.changePage).not.toHaveBeenCalled();
  });

  it('ShouldAddTask_WhenSaveRequestDoesNotContainId', () => {
    component.saveTask({
      title: 'Task',
      description: null,
      statusId: 1,
      priorityId: 3
    });

    expect(taskFacade.addTask).toHaveBeenCalled();
    expect(state.activeModal()).toBeNull();
  });

  it('ShouldEditTask_WhenSaveRequestContainsId', () => {
    component.saveTask({
      id: 'task-1',
      title: 'Task',
      description: null,
      statusId: 1,
      priorityId: 3
    });

    expect(taskFacade.editTask).toHaveBeenCalled();
  });

  it('ShouldOpenCreateModal_WhenCreateFormIsOpened', () => {
    component.openCreateTaskForm();

    expect(taskFacade.clearSelectedTask).toHaveBeenCalled();
    expect(state.activeModal()).toBe(ETaskModal.Create);
  });

  it('ShouldOpenEditModal_WhenActiveTaskExists', () => {
    state.setActiveTask('task-1');

    component.openEditTaskForm();

    expect(taskFacade.getTaskById).toHaveBeenCalledWith('task-1');
    expect(state.activeModal()).toBe(ETaskModal.Edit);
  });

  it('ShouldOpenTaskDetails_WhenTaskIdIsProvided', () => {
    component.openTaskDetailsById('task-1');

    expect(taskFacade.getTaskById).toHaveBeenCalledWith('task-1');
    expect(state.activeModal()).toBe(ETaskModal.View);
  });

  it('ShouldOpenDeleteModal_WhenConfirmationIsEnabled', () => {
    state.setActiveTask('task-1');
    state.setConfirmBeforeDelete(true);

    component.openDeleteConfirmation();

    expect(state.activeModal()).toBe(ETaskModal.Delete);
    expect(taskFacade.deleteTask).not.toHaveBeenCalled();
  });

  it('ShouldDeleteImmediately_WhenConfirmationIsDisabled', () => {
    state.setActiveTask('task-1');
    state.setConfirmBeforeDelete(false);

    component.openDeleteConfirmation();

    expect(taskFacade.deleteTask).toHaveBeenCalledWith(['task-1']);
  });

  it('ShouldDeleteCheckedTasks_WhenDeleteCheckedIsConfirmed', () => {
    state.toggleCheckedTask('task-1');
    state.openModal(ETaskModal.DeleteChecked);

    component.confirmDelete();

    expect(taskFacade.deleteTask).toHaveBeenCalledWith(['task-1']);
    expect(state.checkedTaskIds().size).toBe(0);
  });

  it('ShouldToggleVisibleTasks_WhenToggleAllIsCalled', () => {
    state.tasks.set([task]);

    component.toggleAllVisibleTasks();

    expect(state.checkedTaskIds().has('task-1')).toBe(true);
  });

  it('ShouldForwardSort_WhenOrderingChanges', () => {
    component.orderByPriority();

    expect(taskFacade.orderTasks).toHaveBeenCalledWith(ETaskSort.TaskPriority);
  });

  it('ShouldCloseTaskOptions_WhenDocumentIsClicked', () => {
    state.setTaskOptionsPosition({ top: 10, right: 20 });

    component.onDocumentClick();

    expect(state.taskOptionsPosition()).toBeNull();
  });
});
