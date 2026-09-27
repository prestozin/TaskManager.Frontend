import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '@env/environment.development';
import { ReportParams } from '@features/report/models/report.models';
import { ESortOrder, ETaskSort } from '@features/tasks/enums/task.enum';

import { TaskPagedParams } from '../models/task.models';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TaskService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('ShouldGetTaskById_WhenTaskIdIsProvided', () => {
    service.getTaskById('task-1').subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/Task/task-1`);

    expect(request.request.method).toBe('GET');

    request.flush({ isSuccess: true, message: 'Success', data: {} });
  });

  it('ShouldPostTask_WhenAddTaskIsCalled', () => {
    const body = {
      title: 'Task',
      description: null,
      statusId: 1,
      priorityId: 2
    };

    service.addTask(body).subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/Task/CreateTask`);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);

    request.flush({ isSuccess: true, message: 'Success', data: null });
  });

  it('ShouldPutTask_WhenEditTaskIsCalled', () => {
    const body = {
      id: 'task-1',
      title: 'Task',
      description: 'Description',
      statusId: 2,
      priorityId: 3
    };

    service.editTask(body).subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/Task/EditTask`);

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(body);

    request.flush({ isSuccess: true, message: 'Success', data: null });
  });

  it('ShouldSendIdsInBody_WhenDeleteTaskIsCalled', () => {
    const body = { taskId: ['task-1', 'task-2'] };

    service.deleteTask(body).subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/Task/DeleteTask`);

    expect(request.request.method).toBe('DELETE');
    expect(request.request.body).toEqual(body);

    request.flush({ isSuccess: true, message: 'Success', data: null });
  });

  it('ShouldBuildPagedQuery_WhenFiltersAreProvided', () => {
    const params = new TaskPagedParams();

    params.pageNumber = 2;
    params.pageSize = 20;
    params.sort = ETaskSort.TaskPriority;
    params.order = ESortOrder.Asc;
    params.taskStatusId = 2;
    params.taskPriorityId = 3;
    params.search = 'task';
    params.startDate = '2026-09-01';
    params.endDate = '2026-09-27';

    service.getPaged(params).subscribe();

    const request = httpTesting.expectOne(req =>
      req.url === `${environment.apiUrl}/Task/GetPaged`
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('PageNumber')).toBe('2');
    expect(request.request.params.get('PageSize')).toBe('20');
    expect(request.request.params.get('Sort')).toBe(ETaskSort.TaskPriority);
    expect(request.request.params.get('Order')).toBe(ESortOrder.Asc);
    expect(request.request.params.get('TaskStatusId')).toBe('2');
    expect(request.request.params.get('TaskPriorityId')).toBe('3');
    expect(request.request.params.get('Search')).toBe('task');
    expect(request.request.params.has('StartDate')).toBe(true);
    expect(request.request.params.has('EndDate')).toBe(true);

    request.flush({
      isSuccess: true,
      message: 'Success',
      data: {
        items: [],
        pageNumber: 2,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0
      }
    });
  });

  it('ShouldOmitOptionalPagedQuery_WhenFiltersAreNull', () => {
    const params = new TaskPagedParams();

    service.getPaged(params).subscribe();

    const request = httpTesting.expectOne(req =>
      req.url === `${environment.apiUrl}/Task/GetPaged`
    );

    expect(request.request.params.has('TaskStatusId')).toBe(false);
    expect(request.request.params.has('TaskPriorityId')).toBe(false);
    expect(request.request.params.has('Search')).toBe(false);
    expect(request.request.params.has('StartDate')).toBe(false);
    expect(request.request.params.has('EndDate')).toBe(false);

    request.flush({
      isSuccess: true,
      message: 'Success',
      data: {
        items: [],
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
      }
    });
  });

  it('ShouldGetSelectables_WhenGetSelectablesIsCalled', () => {
    service.getSelectables().subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/Task/GetSelectables`);

    expect(request.request.method).toBe('GET');

    request.flush({
      isSuccess: true,
      message: 'Success',
      data: { status: [], priority: [] }
    });
  });

  it('ShouldBuildReportQuery_WhenDateRangeIsProvided', () => {
    const params = new ReportParams();

    params.pageNumber = 1;
    params.pageSize = 4;
    params.startDate = '2026-09-01';
    params.endDate = '2026-09-27';

    service.getReport(params).subscribe();

    const request = httpTesting.expectOne(req =>
      req.url === `${environment.apiUrl}/Task/GetReport`
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('PageNumber')).toBe('1');
    expect(request.request.params.get('PageSize')).toBe('4');
    expect(request.request.params.has('StartDate')).toBe(true);
    expect(request.request.params.has('EndDate')).toBe(true);

    request.flush({
      isSuccess: true,
      message: 'Success',
      data: { totalTasks: 0, status: [], priority: [], tasks: [] }
    });
  });
});
