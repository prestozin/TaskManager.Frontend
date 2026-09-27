import { Injectable } from '@angular/core';

import { LoginResponse } from '@features/auth/models/auth.models';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    save(login: LoginResponse): void {
        sessionStorage.setItem('token', login.token);
    }

    getAccessToken(): string | null {
        return sessionStorage.getItem('token');
    }

    clear(): void {
        sessionStorage.clear();
    }
}