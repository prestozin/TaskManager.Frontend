import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { ResultResponse } from '@shared/models/response.models';

import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';
import { SKIP_LOADING } from '@core/interceptors/loading/loading.interceptor';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/Auth`;


    login(request: LoginRequest): Observable<ResultResponse<LoginResponse>> {
        return this.httpClient.post<ResultResponse<LoginResponse>>(`${this.apiUrl}/Login`, request, {
            context: new HttpContext().set(SKIP_LOADING, true)
        });
    }

    register(request: RegisterRequest): Observable<ResultResponse<string>> {
        return this.httpClient.post<ResultResponse<string>>(`${this.apiUrl}/Register`, request, {
            context: new HttpContext().set(SKIP_LOADING, true)
        });
    }
}
