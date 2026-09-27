import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { FeedbackService } from '@core/services/feedback/feedback.service';
import { EReportPeriod } from '@features/report/enums/report.enum';
import { ETaskSort } from '@features/tasks/enums/task.enum';
import { TaskService } from '@features/tasks/services/task.service';
import { TaskState } from '@features/tasks/states/task.state';
import { Messages } from '@shared/constants/messages';
import { EFeedbackType } from '@shared/enums/feedback.enum';

import { TaskFacade } from './task.facade';

describe('TaskFacade', () => {
  let facade: TaskFacade;
  let state: TaskState;
  let taskService: {
    getPaged: ReturnType<typeof vi.fn>;
    getTaskById: ReturnType<typeof vi.fn>;
    getSelectables: ReturnType<typeof vi.fn>;
    addTask: ReturnType<typeof vi.fn>;
    editTask: ReturnType<typeof vi.fn>;
    deleteTask: ReturnType<typeof vi.fn>;
    getReport: ReturnType<typeof vi.fn>;
  };
  let feedbackService: { showMessage: ReturnType<typeof vi.fn> };

  const task = {
    id: 'task-1',
    title: 'Task',
    description: null,
    createdAt: '2026-09-27T00:00:00Z',
    status: 'Pendente',
    priority: 'Alta'
  };

  const pagedResponse = {
    items: [task],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 1,
    totalPages: 1
  };

  beforeEach(() => {
    taskService = {
      getPaged: vi.fn(),
      getTaskById: vi.fn(),
      getSelectables: vi.fn(),
      addTask: vi.fn(),
      editTask: vi.fn(),
      deleteTask: vi.fn(),
      getReport: vi.fn()
    };

    feedbackService = {
      showMessage: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        TaskFacade,
        TaskState,
        { provide: TaskService, useValue: taskService },
        { provide: FeedbackService, useValue: feedbackService }
      ]
    });

    facade = TestBed.inject(TaskFacade);
    state = TestBed.inject(TaskState);
  });

  it('ShouldStoreTasks_WhenGetTasksSucceeds', () => {
    taskService.getPaged.mockReturnValue(of({
      isSuccess: true,
      message: 'Success',
      data: pagedResponse
    }));

    facade.getTasks();

    expect(state.tasks()).toEqual([task]);
    expect(state.pagedResponse()).toEqual(pagedResponse);
  });

  it('ShouldClearTasks_WhenGetTasksResponseFails', () => {
    state.tasks.set([task]);

    taskService.getPaged.mockReturnValue(of({
      isSuccess: false,
      message: 'Failed',
      data: null
    }));

    facade.getTasks();

    expect(state.tasks()).toEqual([]);
    expect(state.pagedResponse()).toBeNull();
  });

  it('ShouldClearTasks_WhenGetTasksRequestFails', () => {
    state.tasks.set([task]);
    taskService.getPaged.mockReturnValue(throwError(() => new Error('network')));

    facade.getTasks();

    expect(state.tasks()).toEqual([]);
  });

  it('ShouldStoreSelectedTask_WhenGetTaskByIdSucceeds', () => {
    taskService.getTaskById.mockReturnValue(of({
      isSuccess: true,
      message: 'Success',
      data: task
    }));

    facade.getTaskById('task-1');

    expect(state.selectedTask()).toEqual(task);
  });

  it('ShouldShowError_WhenGetTaskByIdRequestFails', () => {
    const error = new HttpErrorResponse({
      error: {
        isSuccess: false,
        message: 'Task error',
        data: null
      }
    });

    taskService.getTaskById.mockReturnValue(throwError(() => error));

    facade.getTaskById('task-1');

    expect(feedbackService.showMessage).toHaveBeenCalledWith(
      'Task error',
      '',
      EFeedbackType.Error
    );
  });

  it('ShouldStoreSelectables_WhenLoadSelectablesSucceeds', () => {
    taskService.getSelectables.mockReturnValue(of({
      isSuccess: true,
      message: 'Success',
      data: {
        status: [{ id: 1, name: 'Pendente' }],
        priority: [{ id: 3, name: 'Alta' }]
      }
    }));

    facade.loadSelectables();

    expect(state.statusOptions()).toEqual([{ id: 1, name: 'Pendente' }]);
    expect(state.priorityOptions()).toEqual([{ id: 3, name: 'Alta' }]);
  });

  it('ShouldResetAndReloadTasks_WhenAddTaskSucceeds', () => {
    state.pagedParams.pageNumber = 4;
    state.pagedParams.sort = ETaskSort.TaskPriority;

    taskService.addTask.mockReturnValue(of({
      isSuccess: true,
      message: 'Created',
      data: null
    }));

    taskService.getPaged.mockReturnValue(of({
      isSuccess: true,
      message: 'Success',
      data: pagedResponse
    }));

    facade.addTask({
      title: 'Task',
      description: null,
      statusId: 1,
      priorityId: 3
    });

    expect(state.pagedParams.pageNumber).toBe(1);
    expect(state.pagedParams.sort).toBe(ETaskSort.CreatedAt);
    expect(taskService.getPaged).toHaveBeenCalled();
    expect(feedbackService.showMessage).toHaveBeenCalledWith(
      'Created',
      Messages.TaskCreatedSuccessfully,
      EFeedbackType.Success
    );
  });

  it('ShouldNotReloadTasks_WhenAddTaskResponseFails', () => {
    taskService.addTask.mockReturnValue(of({
      isSuccess: false,
      message: 'Failed',
      data: null
    }));

    facade.addTask({
      title: 'Task',
      description: null,
      statusId: 1,
      priorityId: 3
    });

    expect(taskService.getPaged).not.toHaveBeenCalled();
  });

  it('ShouldShowError_WhenDeleteTaskRequestFails', () => {
    const error = new HttpErrorResponse({
      error: {
        isSuccess: false,
        message: 'Delete error',
        data: null
      }
    });

    taskService.deleteTask.mockReturnValue(throwError(() => error));

    facade.deleteTask(['task-1']);

    expect(feedbackService.showMessage).toHaveBeenCalledWith(
      'Delete error',
      Messages.TaskDeleteFailed,
      EFeedbackType.Error
    );
  });

  it('ShouldUpdateSearchAndReloadTasks_WhenSearchChanges', () => {
    taskService.getPaged.mockReturnValue(of({
      isSuccess: true,
      message: 'Success',
      data: pagedResponse
    }));

    facade.searchTasks('  task  ');

    expect(state.pagedParams.search).toBe('task');
    expect(taskService.getPaged).toHaveBeenCalled();
  });

  it('ShouldSetReport_WhenGetReportSucceeds', () => {
    const report = {
      totalTasks: 1,
      status: [],
      priority: [],
      tasks: [task]
    };

    taskService.getReport.mockReturnValue(of({
      isSuccess: true,
      message: 'Success',
      data: report
    }));

    facade.getReport();

    expect(state.report()).toEqual(report);
  });

  it('ShouldClearReport_WhenGetReportResponseFails', () => {
    taskService.getReport.mockReturnValue(of({
      isSuccess: false,
      message: 'Failed',
      data: null
    }));

    facade.getReport();

    expect(state.report()).toBeNull();
  });

  it('ShouldApplySelectedPeriod_WhenReportPeriodChanges', () => {
    taskService.getReport.mockReturnValue(of({
      isSuccess: true,
      message: 'Success',
      data: {
        totalTasks: 0,
        status: [],
        priority: [],
        tasks: []
      }
    }));

    facade.selectReportPeriod(EReportPeriod.SevenDays);

    expect(state.selectedReportPeriod()).toBe(EReportPeriod.SevenDays);
    expect(state.reportParams.startDate).not.toBeNull();
    expect(state.reportParams.endDate).not.toBeNull();
    expect(taskService.getReport).toHaveBeenCalled();
  });
});
