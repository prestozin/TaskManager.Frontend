import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { ResultResponse } from '@shared/models/response.models';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/Auth`;

    login(request: LoginRequest) {

        return this.httpClient
            .post<ResultResponse<LoginResponse>>(`${this.apiUrl}/login`, request)
    }

    register(request: RegisterRequest) {

        return this.httpClient
            .post<ResultResponse<null>>(`${this.apiUrl}/register`, request);
    }
}
