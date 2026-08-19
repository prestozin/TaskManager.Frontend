import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse } from '../../types/login/login-response';
import { TokenService } from '../token/token.service';
import { environment } from '../../environments/environment.development';
import { ResultResponse } from '../../types/result/result-response';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    
    private httpClient = inject(HttpClient);
    private tokenService = inject(TokenService);

    private apiUrl = `${environment.apiUrl}/Auth`;

    login(email: string, password: string) {

        const body = { email, password };
        
        return this.httpClient
            .post<ResultResponse<LoginResponse>>(`${this.apiUrl}/login`, body)
            .pipe( tap(response => {
                this.tokenService.save(response.data);
            })
        );
    }
}
