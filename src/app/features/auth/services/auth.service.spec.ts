import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '@env/environment';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('ShouldPostLoginRequest_WhenLoginIsCalled', () => {
    const requestBody = {
      email: 'user@email.com',
      password: 'Password1!'
    };

    service.login(requestBody).subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/Auth/Login`);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(requestBody);

    request.flush({ isSuccess: true, message: 'Success', data: { token: 'token' } });
  });

  it('ShouldPostRegisterRequest_WhenRegisterIsCalled', () => {
    const requestBody = {
      name: 'User',
      email: 'user@email.com',
      password: 'Password1!'
    };

    service.register(requestBody).subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/Auth/Register`);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(requestBody);

    request.flush({ isSuccess: true, message: 'Success', data: null });
  });
});
