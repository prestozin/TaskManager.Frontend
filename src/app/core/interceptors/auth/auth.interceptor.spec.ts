import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TokenService } from '@core/services/token/token.service';

import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let tokenService: { getAccessToken: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    tokenService = {
      getAccessToken: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: tokenService }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('ShouldAddAuthorizationHeader_WhenTokenExists', () => {
    tokenService.getAccessToken.mockReturnValue('jwt-token');

    httpClient.get('/test').subscribe();

    const request = httpTesting.expectOne('/test');

    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-token');

    request.flush({});
  });

  it('ShouldKeepRequestWithoutAuthorizationHeader_WhenTokenDoesNotExist', () => {
    tokenService.getAccessToken.mockReturnValue(null);

    httpClient.get('/test').subscribe();

    const request = httpTesting.expectOne('/test');

    expect(request.request.headers.has('Authorization')).toBe(false);

    request.flush({});
  });
});
