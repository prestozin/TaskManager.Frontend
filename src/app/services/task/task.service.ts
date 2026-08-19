import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResultResponse } from '../../types/result/result-response';
import { TaskPagedResponse } from '../../types/task/task-paged-response';


@Injectable({
    providedIn: 'root'
})

export class TaskService {
    private httpClient = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/Task`

    getTasks(): Observable<ResultResponse<TaskPagedResponse>> {
        return this.httpClient.get<ResultResponse<TaskPagedResponse>>(`${this.apiUrl}/GetAll`);
    }
}
