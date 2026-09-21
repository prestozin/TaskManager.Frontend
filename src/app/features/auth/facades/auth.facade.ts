import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { TokenService } from '@core/services/token/token.service';


import { getHttpErrorMessage } from '@shared/utils/http-error.util';


import { AuthState } from '../states/auth.state';
import { LoginRequest, RegisterRequest } from '@features/auth/models/auth.models';
import { AuthService } from '@features/auth/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthFacade {

    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly authState = inject(AuthState);
    private readonly tokenService = inject(TokenService);

    readonly handleError = getHttpErrorMessage;

    get isLoading() {
        return this.authState.isLoading;
    }

    get successMessage() {
        return this.authState.successMessage;
    }

    get errorMessage() {
        return this.authState.errorMessage;
    }

    login(request: LoginRequest): void {
        this.authState.isLoading.set(true);
        this.authState.successMessage.set('');
        this.authState.errorMessage.set('');

        this.authService.login(request).subscribe({
            next: response => {
                if (!response.isSuccess || !response.data) {
                    this.authState.isLoading.set(false);
                    this.authState.errorMessage.set(response.message);

                    return;
                } 
                this.authState.successMessage.set(response.message);
                this.tokenService.save(response.data);

                setTimeout(() => {
                    this.authState.isLoading.set(false);
                    this.router.navigate(['/dashboard']);
                }, 1500);
            },
            error: (error: HttpErrorResponse) => {
                this.authState.isLoading.set(false);
                this.authState.errorMessage.set(this.handleError(error));
            }
        });
    }

    register(request: RegisterRequest): void {
        this.authState.isLoading.set(true);
        this.authState.successMessage.set('');
        this.authState.errorMessage.set('');

        this.authService.register(request)
            .pipe(finalize(() => this.authState.isLoading.set(false)))
            .subscribe({
                next: response => {
                    if (!response.isSuccess) {
                        this.authState.errorMessage.set(response.message);
                        return;
                    }
                    this.authState.successMessage.set(response.message);

                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 3000);
                },
                error: (error: HttpErrorResponse) => {
                    this.authState.errorMessage.set(this.handleError(error));
                }
            });
    }

    logout(): void {
        this.tokenService.clear();
        this.router.navigate(['/login']);
    }
}