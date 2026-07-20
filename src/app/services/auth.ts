import { HttpClient } from '@angular/common/http';
import { inject, Service  } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse } from '../types/login-response';
import { TokenService } from './token';

@Service()
export class AuthService {
    
    private httpClient = inject(HttpClient);
    private tokenService = inject(TokenService);

    login(email: string, password: string) {

        const body = { email, password };
        
        return this.httpClient
            .post<LoginResponse>("/login", body)
            .pipe(tap(result => {this.tokenService.save(result);}));
    }
}
