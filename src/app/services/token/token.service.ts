import { Injectable } from '@angular/core';
import { LoginResponse } from '../../types/login/login-response';

@Injectable({
    providedIn: 'root'
})

export class TokenService {

    save(login: LoginResponse) {
        sessionStorage.setItem("token", login.token);
        sessionStorage.setItem("name", login.name);
    }

    getAccessToken() {
        return sessionStorage.getItem("token");
    }

    getName() {
        return sessionStorage.getItem("name");
    }

    clear() {
        sessionStorage.clear();
    }
}
