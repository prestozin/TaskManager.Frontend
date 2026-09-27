import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '@env/environment.development';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProfileService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('ShouldGetProfile_WhenGetProfileIsCalled', () => {
    service.getProfile().subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/User/GetUser`);

    expect(request.request.method).toBe('GET');

    request.flush({ isSuccess: true, message: 'Success', data: {} });
  });

  it('ShouldPutProfileRequest_WhenEditProfileIsCalled', () => {
    const body = {
      name: 'User',
      role: 'Developer',
      area: 'Software',
      about: null
    };

    service.editProfile(body).subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/User/EditUser`);

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(body);

    request.flush({ isSuccess: true, message: 'Success', data: null });
  });

  it('ShouldSendPasswordInBody_WhenDeleteProfileIsCalled', () => {
    service.deleteProfile('Password1!').subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/User/DeleteUser`);

    expect(request.request.method).toBe('DELETE');
    expect(request.request.body).toEqual({ password: 'Password1!' });

    request.flush({ isSuccess: true, message: 'Success', data: null });
  });

  it('ShouldPatchPasswordRequest_WhenChangePasswordIsCalled', () => {
    const body = {
      oldPassword: 'OldPassword1!',
      newPassword: 'NewPassword1!'
    };

    service.changePassword(body).subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/User/ChangePassword`);

    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(body);

    request.flush({ isSuccess: true, message: 'Success', data: null });
  });
});
