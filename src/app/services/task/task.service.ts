import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResultResponse } from '../../types/result/result-response';
import { PagedResponse } from '../../types/task/paged-response';
import { TaskPagedParams } from '../../types/task/task-paged-params';


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
        return this.httpClient.get<ResultResponse<PagedResponse>>
            (`${this.apiUrl}/GetPaged`, { params: httpParams });
    }
}
