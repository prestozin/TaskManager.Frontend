import { EReportPeriod } from '@features/report/enums/report.enum';
import { ESortOrder, ETaskFilter, ETaskModal, ETaskSort } from '@features/tasks/enums/task.enum';
import { TaskResponse } from '@features/tasks/models/task.models';

import { TaskState } from './task.state';

describe('TaskState', () => {
  let state: TaskState;

  const task: TaskResponse = {
    id: 'task-1',
    title: 'Task',
    description: null,
    createdAt: '2026-09-27T00:00:00Z',
    status: 'Pendente',
    priority: 'Alta'
  };

  beforeEach(() => {
    state = new TaskState();
  });

  it('ShouldSetTasksAndPagination_WhenPagedResponseIsProvided', () => {
    state.setTasks({
      items: [task],
      pageNumber: 2,
      pageSize: 10,
      totalCount: 11,
      totalPages: 2
    });

    expect(state.tasks()).toEqual([task]);
    expect(state.currentPage()).toBe(2);
  });

  it('ShouldClearTasks_WhenClearTasksIsCalled', () => {
    state.setTasks({
      items: [task],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 1,
      totalPages: 1
    });

    state.clearTasks();

    expect(state.tasks()).toEqual([]);
    expect(state.pagedResponse()).toBeNull();
    expect(state.currentPage()).toBe(1);
  });

  it('ShouldTrimSearchAndResetPage_WhenSearchIsSet', () => {
    state.setPage(5);

    state.setSearch('  task  ');

    expect(state.pagedParams.search).toBe('task');
    expect(state.pagedParams.pageNumber).toBe(1);
  });

  it('ShouldSetSearchToNull_WhenSearchContainsOnlyWhitespace', () => {
    state.setSearch('   ');

    expect(state.pagedParams.search).toBeNull();
  });

  it('ShouldSetStatusFilter_WhenStatusIsSelected', () => {
    state.setPage(3);

    state.setStatus({ id: 2, name: 'Em Progresso' });

    expect(state.selectedStatus().id).toBe(2);
    expect(state.pagedParams.taskStatusId).toBe(2);
    expect(state.pagedParams.pageNumber).toBe(1);
  });

  it('ShouldClearStatusFilter_WhenAllStatusIsSelected', () => {
    state.setStatus({ id: ETaskFilter.All, name: 'Todos os status' });

    expect(state.pagedParams.taskStatusId).toBeNull();
  });

  it('ShouldSetPriorityFilter_WhenPriorityIsSelected', () => {
    state.setPriority({ id: 3, name: 'Alta' });

    expect(state.selectedPriority().id).toBe(3);
    expect(state.pagedParams.taskPriorityId).toBe(3);
  });

  it('ShouldResetFilters_WhenClearFiltersIsCalled', () => {
    state.setSearch('task');
    state.setStatus({ id: 2, name: 'Em Progresso' });
    state.setPriority({ id: 3, name: 'Alta' });

    state.clearFilters();

    expect(state.pagedParams.search).toBeNull();
    expect(state.pagedParams.taskStatusId).toBeNull();
    expect(state.pagedParams.taskPriorityId).toBeNull();
    expect(state.selectedStatus().id).toBe(ETaskFilter.All);
    expect(state.selectedPriority().id).toBe(ETaskFilter.All);
    expect(state.pagedParams.pageNumber).toBe(1);
  });

  it('ShouldUpdatePageSizeAndResetPage_WhenPageSizeChanges', () => {
    state.setPage(4);

    state.setPageSize(30);

    expect(state.pageSize()).toBe(30);
    expect(state.pagedParams.pageSize).toBe(30);
    expect(state.pagedParams.pageNumber).toBe(1);
  });

  it('ShouldToggleSortOrder_WhenSortIsChanged', () => {
    state.pagedParams.order = ESortOrder.Desc;

    state.toggleSort(ETaskSort.TaskPriority);

    expect(state.pagedParams.order).toBe(ESortOrder.Asc);
    expect(state.pagedParams.sort).toBe(ETaskSort.TaskPriority);

    state.toggleSort(ETaskSort.TaskPriority);

    expect(state.pagedParams.order).toBe(ESortOrder.Desc);
  });

  it('ShouldResetPageAndSort_WhenTaskIsCreated', () => {
    state.pagedParams.pageNumber = 4;
    state.pagedParams.sort = ETaskSort.TaskPriority;
    state.pagedParams.order = ESortOrder.Asc;

    state.resetAfterCreate();

    expect(state.pagedParams.pageNumber).toBe(1);
    expect(state.pagedParams.sort).toBe(ETaskSort.CreatedAt);
    expect(state.pagedParams.order).toBe(ESortOrder.Desc);
  });

  it('ShouldToggleCheckedTask_WhenTaskIsSelectedTwice', () => {
    state.toggleCheckedTask('task-1');
    expect(state.checkedTaskIds().has('task-1')).toBe(true);

    state.toggleCheckedTask('task-1');
    expect(state.checkedTaskIds().has('task-1')).toBe(false);
  });

  it('ShouldToggleAllVisibleTasks_WhenAllTasksAreProvided', () => {
    state.toggleAllCheckedTasks(['task-1', 'task-2']);

    expect(state.checkedTaskIds()).toEqual(new Set(['task-1', 'task-2']));

    state.toggleAllCheckedTasks(['task-1', 'task-2']);

    expect(state.checkedTaskIds().size).toBe(0);
  });

  it('ShouldResetUiState_WhenResetUiStateIsCalled', () => {
    state.setActiveTask('task-1');
    state.toggleCheckedTask('task-1');
    state.setTaskOptionsPosition({ top: 10, right: 20, openUpward: false });
    state.openModal(ETaskModal.View);
    state.startClosingTaskDetails();

    state.resetUiState();

    expect(state.activeTaskId()).toBeNull();
    expect(state.checkedTaskIds().size).toBe(0);
    expect(state.taskOptionsPosition()).toBeNull();
    expect(state.activeModal()).toBeNull();
    expect(state.isClosingTaskDetails()).toBe(false);
  });

  it('ShouldUpdateReportFilters_WhenReportDateRangeChanges', () => {
    state.reportParams.pageNumber = 5;

    state.setReportDateRange('2026-09-01', '2026-09-27');

    expect(state.selectedReportStartDate()).toBe('2026-09-01');
    expect(state.selectedReportEndDate()).toBe('2026-09-27');
    expect(state.reportParams.startDate).toBe('2026-09-01');
    expect(state.reportParams.endDate).toBe('2026-09-27');
    expect(state.reportParams.pageNumber).toBe(1);
  });

  it('ShouldUpdateReportPeriod_WhenPeriodIsSelected', () => {
    state.setReportPeriod(EReportPeriod.SevenDays);

    expect(state.selectedReportPeriod()).toBe(EReportPeriod.SevenDays);
  });
});
