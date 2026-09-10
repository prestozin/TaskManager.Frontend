import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { TaskCreateRequest, TaskEditRequest, TaskPagedParams, TaskResponse, TaskSelectablesResponse } from '../models/task.models';
import { ResultResponse } from '../../../shared/models/response.models';
import { PagedResponse } from '../../../shared/models/pagination.models';



@Injectable({
    providedIn: 'root'
})

export class TaskService {
    private httpClient = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/Task`

    addTask(request: TaskCreateRequest): Observable<ResultResponse<string>> {
        return this.httpClient.post<ResultResponse<string>>
            (`${this.apiUrl}/AddTask`, request);
    }

    editTask(request: TaskEditRequest): Observable<ResultResponse<string>> {
        return this.httpClient.put<ResultResponse<string>>
            (`${this.apiUrl}/EditTask`, request);
    }

    deleteTask(taskId: string): Observable<ResultResponse<string>> {
        return this.httpClient.delete<ResultResponse<string>>
            (`${this.apiUrl}/${taskId}`);
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

        return httpParams;
    }

    getSelectables(): Observable<ResultResponse<TaskSelectablesResponse>> {
        return this.httpClient.get<ResultResponse<TaskSelectablesResponse>>
            (`${this.apiUrl}/GetSelectables`);
    }
}
