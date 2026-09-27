import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { TokenService } from '@core/services/token/token.service';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let tokenService: { getAccessToken: ReturnType<typeof vi.fn> };
  let router: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    tokenService = {
      getAccessToken: vi.fn()
    };

    router = {
      createUrlTree: vi.fn().mockReturnValue({} as UrlTree)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: tokenService },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('ShouldAllowNavigation_WhenTokenExists', () => {
    tokenService.getAccessToken.mockReturnValue('jwt-token');

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    );

    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('ShouldRedirectToLogin_WhenTokenDoesNotExist', () => {
    tokenService.getAccessToken.mockReturnValue(null);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    );

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(router.createUrlTree.mock.results[0].value);
  });
});
