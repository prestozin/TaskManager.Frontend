import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { environment } from '@env/environment.development';
import { ResultResponse } from '@shared/models/response.models';
import { Observable } from 'rxjs';
import { ProfileResponse } from '../models/profile.models';

@Injectable({
    providedIn: 'root'
})

export class ProfileService {
    private httpClient = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/User`

    getProfile(): Observable<ResultResponse<ProfileResponse>> {
        return this.httpClient.get<ResultResponse<ProfileResponse>>
            (`${this.apiUrl}`);
    }
}

