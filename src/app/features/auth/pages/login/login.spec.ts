import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFacade } from '@features/auth/facades/auth.facade';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authFacade: {
    successMessage: ReturnType<typeof signal<string>>;
    errorMessage: ReturnType<typeof signal<string>>;
    clearMessages: ReturnType<typeof vi.fn>;
    login: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authFacade = {
      successMessage: signal(''),
      errorMessage: signal(''),
      clearMessages: vi.fn(),
      login: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthFacade, useValue: authFacade }
      ]
    })
      .overrideComponent(Login, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ShouldClearMessages_WhenComponentInitializes', () => {
    expect(authFacade.clearMessages).toHaveBeenCalled();
  });

  it('ShouldMarkFormAsTouched_WhenSubmitIsInvalid', () => {
    component.submit();

    expect(component.loginForm.controls.email.touched).toBe(true);
    expect(component.loginForm.controls.password.touched).toBe(true);
    expect(authFacade.login).not.toHaveBeenCalled();
  });

  it('ShouldCallLogin_WhenFormIsValid', () => {
    component.loginForm.setValue({
      email: 'user@email.com',
      password: 'Password1!'
    });

    component.submit();

    expect(authFacade.login).toHaveBeenCalledWith({
      email: 'user@email.com',
      password: 'Password1!'
    });
  });

  it('ShouldRejectInvalidEmail_WhenEmailFormatIsWrong', () => {
    component.loginForm.controls.email.setValue('invalid-email');

    expect(component.loginForm.controls.email.invalid).toBe(true);
  });
});
