import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResultResponse } from '../../types/result/result-response';
import { PagedResponse } from '../../types/task/paged-response';
import { TaskPagedParams } from '../../types/task/task-paged-params';
import { TaskSelectablesResponse } from '../../interfaces/task-selectables-response';


@Injectable({
    providedIn: 'root'
})

export class TaskService {
    private httpClient = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/Task`

    getPaged(params: TaskPagedParams): Observable<ResultResponse<PagedResponse>> {

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
        return this.httpClient.get<ResultResponse<PagedResponse>>
            (`${this.apiUrl}/GetPaged`, { params: httpParams });
    }

    getSelectables(): Observable<ResultResponse<TaskSelectablesResponse>> {
        return this.httpClient.get<ResultResponse<TaskSelectablesResponse>>
            (`${this.apiUrl}/GetSelectables`);
    }
}
