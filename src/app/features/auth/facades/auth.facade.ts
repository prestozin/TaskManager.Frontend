import { inject, Injectable, signal } from "@angular/core";
import { TokenService } from "@core/services/token/token.service";
import { ResultResponse } from "@shared/models/response.models";
import { Observable, tap } from "rxjs";
import { LoginRequest, LoginResponse, RegisterRequest } from "../models/auth.models";
import { AuthService } from "../services/auth.service";


@Injectable({
    providedIn: 'root'
})

export class AuthFacade {
    private authService = inject(AuthService);
    private tokenService = inject(TokenService);

    errorMessage = signal<string | null>(null);

    login(request: LoginRequest): Observable<ResultResponse<LoginResponse>> {
        return this.authService.login(request).pipe(
            tap(response => {
                this.tokenService.save(response.data);
            })
        );
    }

    register(request: RegisterRequest): Observable<ResultResponse<null>> {
        return this.authService.register(request);
    }
}
