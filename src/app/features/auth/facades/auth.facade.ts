import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { TokenService } from '@core/services/token/token.service';
import { AuthService } from '@features/auth/services/auth.service';
import { AuthState } from '@features/auth/states/auth.state';
import { LoginRequest, RegisterRequest } from '@features/auth/models/auth.models';
import { getHttpErrorMessage } from '@shared/utils/http-error/http-error.util';

@Injectable({
    providedIn: 'root'
})
export class AuthFacade {

    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly authState = inject(AuthState);
    private readonly tokenService = inject(TokenService);

    readonly isLoading = this.authState.isLoading;

    get successMessage() {
        return this.authState.successMessage;
    }

    get errorMessage() {
        return this.authState.errorMessage;
    }

    login(request: LoginRequest): void {
        this.isLoading.set(true);
        this.clearMessages();

        this.authService.login(request).pipe(
            finalize(() => this.isLoading.set(false))).subscribe({
                next: response => {
                    if (!response.isSuccess) {
                        this.authState.errorMessage.set(response.message);
                        return;
                    }

                    this.authState.successMessage.set(response.message);
                    this.tokenService.save(response.data!);

                    setTimeout(() => {
                        this.router.navigate(['/tasks']);
                    }, 1000);
                },

                error: (error: HttpErrorResponse) => {
                    this.authState.errorMessage.set(getHttpErrorMessage(error));
                }
            });
    }

    register(request: RegisterRequest): void {
        this.isLoading.set(true);
        this.clearMessages();

        this.authService.register(request).pipe(
            finalize(() => this.isLoading.set(false))).subscribe({
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
                    this.authState.errorMessage.set(getHttpErrorMessage(error));
                }
            });
    }

    logout(): void {
        this.clearMessages();
        this.tokenService.clear();
        this.router.navigate(['/login']);
    }

    clearMessages(): void {
        this.authState.successMessage.set('');
        this.authState.errorMessage.set('');
    }
}
