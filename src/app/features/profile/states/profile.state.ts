import { Injectable, signal } from '@angular/core';

import { ProfileResponse } from '@features/profile/models/profile.models';

@Injectable({
    providedIn: 'root'
})
export class ProfileState {

    readonly profile = signal<ProfileResponse | null>(null);
    readonly isLoading = signal(false);
}
