import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthState {

    readonly isLoading = signal(false);
    readonly successMessage = signal('');
    readonly errorMessage = signal('');
}