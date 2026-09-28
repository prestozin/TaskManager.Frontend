import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('ShouldStartNotLoading_WhenServiceIsCreated', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('ShouldSetLoadingTrue_WhenRequestStarts', () => {
    service.show();

    expect(service.isLoading()).toBe(true);
  });

  it('ShouldSetLoadingFalse_WhenOnlyRequestFinishes', () => {
    service.show();

    service.hide();

    expect(service.isLoading()).toBe(false);
  });

  it('ShouldKeepLoadingTrue_WhenAnotherRequestIsStillPending', () => {
    service.show();
    service.show();

    service.hide();

    expect(service.isLoading()).toBe(true);

    service.hide();

    expect(service.isLoading()).toBe(false);
  });

  it('ShouldKeepLoadingFalse_WhenHideIsCalledWithoutPendingRequests', () => {
    service.hide();

    expect(service.isLoading()).toBe(false);
  });
});
