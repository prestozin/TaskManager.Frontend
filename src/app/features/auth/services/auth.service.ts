import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { ResultResponse } from '@shared/models/response.models';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/Auth`;

    login(request: LoginRequest): Observable<ResultResponse<LoginResponse>> {
        return this.httpClient.post<ResultResponse<LoginResponse>>(`${this.apiUrl}/Login`, request);
    }

    register(request: RegisterRequest): Observable<ResultResponse<null>> {
        return this.httpClient.post<ResultResponse<null>>(`${this.apiUrl}/register`, request);
    }
}
