import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { TaskPagedParams, TaskResponse, TaskSelectablesResponse } from '../models/task.models';
import { ResultResponse } from '../../../shared/models/response.models';
import { PagedResponse } from '../../../shared/models/pagination.models';



@Injectable({
    providedIn: 'root'
})

export class TaskService {
    private httpClient = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/Task`

    getPaged(params: TaskPagedParams): Observable<ResultResponse<PagedResponse<TaskResponse>>> {

        let httpParams = new HttpParams()
            .set('PageNumber', params.pageNumber)
            .set('PageSize', params.pageSize)
            .set('Sort', params.sort)
            .set('Order', params.order);

        if (params.taskStatusId !== null) {
            httpParams = httpParams.set('TaskStatusId', params.taskStatusId);
        }

        if (params.taskPriorityId !== null) {
            httpParams = httpParams.set('TaskPriorityId', params.taskPriorityId);
        }
        return this.httpClient.get<ResultResponse<PagedResponse<TaskResponse>>>
            (`${this.apiUrl}/GetPaged`, { params: httpParams });
    }

    getSelectables(): Observable<ResultResponse<TaskSelectablesResponse>> {
        return this.httpClient.get<ResultResponse<TaskSelectablesResponse>>
            (`${this.apiUrl}/GetSelectables`);
    }
}
