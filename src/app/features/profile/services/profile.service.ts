import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment.development';
import {
    ChangePasswordRequest,
    EditProfileRequest,
    ProfileResponse
} from '@features/profile/models/profile.models';
import { ResultResponse } from '@shared/models/response.models';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/User`;

    getProfile(): Observable<ResultResponse<ProfileResponse>> {
        return this.httpClient.get<ResultResponse<ProfileResponse>>(
            `${this.apiUrl}/GetUser`
        );
    }

    editProfile(request: EditProfileRequest): Observable<ResultResponse<string>> {
        return this.httpClient.put<ResultResponse<string>>(
            `${this.apiUrl}/EditUser`,
            request
        );
    }

    deleteProfile(password: string): Observable<ResultResponse<string>> {
        return this.httpClient.delete<ResultResponse<string>>(
            `${this.apiUrl}/DeleteUser`,
            {
                params: {
                    password
                }
            }
        );
    }

    changePassword(request: ChangePasswordRequest): Observable<ResultResponse<string>> {
        return this.httpClient.patch<ResultResponse<string>>(
            `${this.apiUrl}/ChangePassword`,
            request
        );
    }
}
