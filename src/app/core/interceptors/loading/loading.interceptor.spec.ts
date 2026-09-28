import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LoadingService } from '@core/services/loading/loading.service';

import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let loadingService: {
    show: ReturnType<typeof vi.fn>;
    hide: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    loadingService = {
      show: vi.fn(),
      hide: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
        { provide: LoadingService, useValue: loadingService }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('ShouldShowLoading_WhenRequestStarts', () => {
    httpClient.get('/test').subscribe();

    const request = httpTesting.expectOne('/test');

    expect(loadingService.show).toHaveBeenCalledTimes(1);
    expect(loadingService.hide).not.toHaveBeenCalled();

    request.flush({});
  });

  it('ShouldHideLoading_WhenRequestSucceeds', () => {
    httpClient.get('/test').subscribe();

    const request = httpTesting.expectOne('/test');
    request.flush({});

    expect(loadingService.hide).toHaveBeenCalledTimes(1);
  });

  it('ShouldHideLoading_WhenRequestFails', () => {
    httpClient.get('/test').subscribe({
      error: () => undefined
    });

    const request = httpTesting.expectOne('/test');
    request.flush(
      { message: 'Error' },
      {
        status: 500,
        statusText: 'Internal Server Error'
      }
    );

    expect(loadingService.hide).toHaveBeenCalledTimes(1);
  });

  it('ShouldTrackEachRequestIndependently_WhenRequestsRunAtTheSameTime', () => {
    httpClient.get('/first').subscribe();
    httpClient.get('/second').subscribe();

    const firstRequest = httpTesting.expectOne('/first');
    const secondRequest = httpTesting.expectOne('/second');

    expect(loadingService.show).toHaveBeenCalledTimes(2);

    firstRequest.flush({});

    expect(loadingService.hide).toHaveBeenCalledTimes(1);

    secondRequest.flush({});

    expect(loadingService.hide).toHaveBeenCalledTimes(2);
  });
});
