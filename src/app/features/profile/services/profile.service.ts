import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { ResultResponse } from '@shared/models/response.models';
import { Observable } from 'rxjs';
import { EditProfileRequest, ProfileResponse } from '../models/profile.models';

@Injectable({
    providedIn: 'root'
})

export class ProfileService {
    
    private httpClient = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/User`

    getProfile(): Observable<ResultResponse<ProfileResponse>> {
        return this.httpClient.get<ResultResponse<ProfileResponse>>
            (`${this.apiUrl}/GetUser`);
    }

    editProfile(request: EditProfileRequest): Observable<ResultResponse<string>> {
        return this.httpClient.put<ResultResponse<string>>
            (`${this.apiUrl}/EditUser`, request);
    }

    deleteProfile(password: string): Observable<ResultResponse<string>> {
        return this.httpClient.delete<ResultResponse<string>>
            (`${this.apiUrl}/DeleteUser`,
                {
                    body: password
                }
            );
    }

}

