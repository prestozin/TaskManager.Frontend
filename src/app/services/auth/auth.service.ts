import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginResponse } from '../../types/auth/login-response';
import { environment } from '../../environments/environment.development';
import { ResultResponse } from '../../types/result/result-response';
import { RegisterRequest } from '../../interfaces/auth/register-request';
import { LoginRequest } from '../../interfaces/auth/login-request';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private httpClient = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/Auth`;

    login(request: LoginRequest) {

        return this.httpClient
            .post<ResultResponse<LoginResponse>>(`${this.apiUrl}/login`, request)
    }

    register(request: RegisterRequest) {

        return this.httpClient
            .post<ResultResponse<null>>(`${this.apiUrl}/register`, request);

    }
}
