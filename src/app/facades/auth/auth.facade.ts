import { inject, Injectable, signal } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { TokenService } from "../../services/token/token.service";
import { LoginRequest } from "../../interfaces/auth/login-request";
import { HttpErrorResponse } from "@angular/common/http";
import { RegisterRequest } from "../../interfaces/auth/register-request";
import { tap } from "rxjs/internal/operators/tap";
import { LoginResponse } from "../../types/auth/login-response";
import { ResultResponse } from "../../types/result/result-response";
import { Observable } from "rxjs/internal/Observable";


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
