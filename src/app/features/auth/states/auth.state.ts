import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthState {

    readonly successMessage = signal('');
    readonly errorMessage = signal('');
}