import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { DeleteTaskRequest, TaskCreateRequest, TaskEditRequest, TaskPagedParams, TaskReportParams, TaskReportResponse, TaskResponse, TaskSelectablesResponse } from '../models/task.models';
import { ResultResponse } from '../../../shared/models/response.models';
import { PagedResponse } from '../../../shared/models/pagination.models';



@Injectable({
    providedIn: 'root'
})

export class TaskService {
    private httpClient = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/Task`

    getTaskById(taskId: string): Observable<ResultResponse<TaskResponse>> {
        return this.httpClient.get<ResultResponse<TaskResponse>>
            (`${this.apiUrl}/${taskId}`);
    }

    addTask(request: TaskCreateRequest): Observable<ResultResponse<string>> {
        return this.httpClient.post<ResultResponse<string>>
            (`${this.apiUrl}/CreateTask`, request);
    }

    editTask(request: TaskEditRequest): Observable<ResultResponse<string>> {
        return this.httpClient.put<ResultResponse<string>>
            (`${this.apiUrl}/EditTask`, request);
    }

    deleteTask(request: DeleteTaskRequest): Observable<ResultResponse<string>> {
        return this.httpClient.delete<ResultResponse<string>>(
            `${this.apiUrl}/DeleteTask`,
            {
                body: request
            }
        );
    }

    getPaged(params: TaskPagedParams): Observable<ResultResponse<PagedResponse<TaskResponse>>> {
        const httpParams = this.buildHttpParams(params);

        return this.httpClient.get<ResultResponse<PagedResponse<TaskResponse>>>
            (`${this.apiUrl}/GetPaged`, { params: httpParams });
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

        if (params.startDate)
            httpParams = httpParams.set(
                'StartDate', this.convertLocalDateToUtc(params.startDate)
            );


        if (params.endDate)
            httpParams = httpParams.set(
                'EndDate', this.convertLocalDateToUtc(params.endDate, true)
            );

        return httpParams;
    }

    getSelectables(): Observable<ResultResponse<TaskSelectablesResponse>> {
        return this.httpClient.get<ResultResponse<TaskSelectablesResponse>>
            (`${this.apiUrl}/GetSelectables`);
    }

    getReport(request: TaskReportParams): Observable<ResultResponse<TaskReportResponse>> {
        let params = new HttpParams()
            .set('PageNumber', request.pageNumber)
            .set('PageSize', request.pageSize);

        if (request.startDate)
            params = params.set(
                'StartDate', this.convertLocalDateToUtc(request.startDate)
            );

        if (request.endDate)
            params = params.set(
                'EndDate', this.convertLocalDateToUtc(request.endDate, true)
            );

        return this.httpClient.get<ResultResponse<TaskReportResponse>>(
            `${this.apiUrl}/GetReport`,
            { params }
        );
    }

    private convertLocalDateToUtc(date: string, endOfDay = false): string {
        const [year, month, day] = date.split('-').map(Number);

        const localDate = new Date(year, month - 1, endOfDay ? day + 1 : day);

        return localDate.toISOString();
    }
}
