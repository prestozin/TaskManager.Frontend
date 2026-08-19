import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { TaskResponse } from '../../types/task/task-response';


@Injectable({
    providedIn: 'root'
})

export class TaskService {
    private httpClient = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/Task`

    getTasks(): Observable<TaskResponse[]> {
        return this.httpClient.get<TaskResponse[]>(`${this.apiUrl}/GetAll`);
    }
}
