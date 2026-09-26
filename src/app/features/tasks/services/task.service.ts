import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment.development';
import {
    ReportParams,
    ReportResponse
} from '@features/report/models/report.models';
import {
    DeleteTaskRequest,
    TaskCreateRequest,
    TaskEditRequest,
    TaskPagedParams,
    TaskResponse,
    TaskSelectablesResponse
} from '@features/tasks/models/task.models';
import { PagedResponse } from '@shared/models/pagination.models';
import { ResultResponse } from '@shared/models/response.models';
import { convertLocalDateToUtc } from '@shared/utils/date.util';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/Task`;

    getTaskById(taskId: string): Observable<ResultResponse<TaskResponse>> {
        return this.httpClient.get<ResultResponse<TaskResponse>>(
            `${this.apiUrl}/${taskId}`
        );
    }

    addTask(request: TaskCreateRequest): Observable<ResultResponse<string>> {
        return this.httpClient.post<ResultResponse<string>>(
            `${this.apiUrl}/CreateTask`,
            request
        );
    }

    editTask(request: TaskEditRequest): Observable<ResultResponse<string>> {
        return this.httpClient.put<ResultResponse<string>>(
            `${this.apiUrl}/EditTask`,
            request
        );
    }

    deleteTask(request: DeleteTaskRequest): Observable<ResultResponse<string>> {
        return this.httpClient.delete<ResultResponse<string>>(
            `${this.apiUrl}/DeleteTask`,
            { body: request }
        );
    }

    getPaged(params: TaskPagedParams): Observable<ResultResponse<PagedResponse<TaskResponse>>> {
        return this.httpClient.get<ResultResponse<PagedResponse<TaskResponse>>>(
            `${this.apiUrl}/GetPaged`,
            { params: this.buildHttpParams(params) }
        );
    }

    getSelectables(): Observable<ResultResponse<TaskSelectablesResponse>> {
        return this.httpClient.get<ResultResponse<TaskSelectablesResponse>>(
            `${this.apiUrl}/GetSelectables`
        );
    }

    getReport(request: ReportParams): Observable<ResultResponse<ReportResponse>> {
        let params = new HttpParams()
            .set('PageNumber', request.pageNumber)
            .set('PageSize', request.pageSize);

        if (request.startDate) {
            params = params.set(
                'StartDate',
                convertLocalDateToUtc(request.startDate)
            );
        }

        if (request.endDate) {
            params = params.set(
                'EndDate',
                convertLocalDateToUtc(request.endDate, true)
            );
        }

        return this.httpClient.get<ResultResponse<ReportResponse>>(
            `${this.apiUrl}/GetReport`,
            { params }
        );
    }

    private buildHttpParams(params: TaskPagedParams): HttpParams {
        let httpParams = new HttpParams()
            .set('PageNumber', params.pageNumber)
            .set('PageSize', params.pageSize)
            .set('Sort', params.sort)
            .set('Order', params.order);

        if (params.taskStatusId !== null)
            httpParams = httpParams.set('TaskStatusId', params.taskStatusId);

        if (params.taskPriorityId !== null)
            httpParams = httpParams.set('TaskPriorityId', params.taskPriorityId);

        if (params.search)
            httpParams = httpParams.set('Search', params.search);

        if (params.startDate) {
            httpParams = httpParams.set(
                'StartDate',
                convertLocalDateToUtc(params.startDate)
            );
        }

        if (params.endDate) {
            httpParams = httpParams.set(
                'EndDate',
                convertLocalDateToUtc(params.endDate, true)
            );
        }

        return httpParams;
    }
}