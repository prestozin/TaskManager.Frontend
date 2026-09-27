import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { TokenService } from '@core/services/token/token.service';
import { AuthService } from '@features/auth/services/auth.service';
import { AuthState } from '@features/auth/states/auth.state';

import { AuthFacade } from './auth.facade';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let state: AuthState;
  let authService: {
    login: ReturnType<typeof vi.fn>;
    register: ReturnType<typeof vi.fn>;
  };
  let tokenService: {
    save: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };
  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.useFakeTimers();

    authService = {
      login: vi.fn(),
      register: vi.fn()
    };

    tokenService = {
      save: vi.fn(),
      clear: vi.fn()
    };

    router = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        AuthState,
        { provide: AuthService, useValue: authService },
        { provide: TokenService, useValue: tokenService },
        { provide: Router, useValue: router }
      ]
    });

    facade = TestBed.inject(AuthFacade);
    state = TestBed.inject(AuthState);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ShouldSaveTokenAndNavigate_WhenLoginSucceeds', () => {
    const response = {
      isSuccess: true,
      message: 'Login realizado',
      data: { token: 'jwt-token' }
    };

    authService.login.mockReturnValue(of(response));

    facade.login({
      email: 'user@email.com',
      password: 'Password1!'
    });

    expect(tokenService.save).toHaveBeenCalledWith(response.data);
    expect(state.successMessage()).toBe('Login realizado');
    expect(state.isLoading()).toBe(true);

    vi.advanceTimersByTime(1500);

    expect(state.isLoading()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('ShouldSetErrorMessage_WhenLoginResponseFails', () => {
    authService.login.mockReturnValue(of({
      isSuccess: false,
      message: 'Credenciais inválidas',
      data: null
    }));

    facade.login({
      email: 'user@email.com',
      password: 'wrong'
    });

    expect(state.errorMessage()).toBe('Credenciais inválidas');
    expect(state.isLoading()).toBe(false);
    expect(tokenService.save).not.toHaveBeenCalled();
  });

  it('ShouldSetHttpErrorMessage_WhenLoginRequestFails', () => {
    const error = new HttpErrorResponse({
      error: {
        isSuccess: false,
        message: 'Erro de login',
        data: null
      }
    });

    authService.login.mockReturnValue(throwError(() => error));

    facade.login({
      email: 'user@email.com',
      password: 'Password1!'
    });

    expect(state.errorMessage()).toBe('Erro de login');
    expect(state.isLoading()).toBe(false);
  });

  it('ShouldNavigateToLogin_WhenRegisterSucceeds', () => {
    authService.register.mockReturnValue(of({
      isSuccess: true,
      message: 'Usuário criado',
      data: null
    }));

    facade.register({
      name: 'User',
      email: 'user@email.com',
      password: 'Password1!'
    });

    expect(state.successMessage()).toBe('Usuário criado');
    expect(state.isLoading()).toBe(false);

    vi.advanceTimersByTime(3000);

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('ShouldSetErrorMessage_WhenRegisterResponseFails', () => {
    authService.register.mockReturnValue(of({
      isSuccess: false,
      message: 'E-mail já cadastrado',
      data: null
    }));

    facade.register({
      name: 'User',
      email: 'user@email.com',
      password: 'Password1!'
    });

    expect(state.errorMessage()).toBe('E-mail já cadastrado');
  });

  it('ShouldClearSessionAndNavigate_WhenLogoutIsCalled', () => {
    state.successMessage.set('success');
    state.errorMessage.set('error');

    facade.logout();

    expect(tokenService.clear).toHaveBeenCalled();
    expect(state.successMessage()).toBe('');
    expect(state.errorMessage()).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
