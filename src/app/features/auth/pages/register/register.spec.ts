import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFacade } from '@features/auth/facades/auth.facade';
import { Messages } from '@shared/constants/messages';

import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authFacade: {
    successMessage: ReturnType<typeof signal<string>>;
    errorMessage: ReturnType<typeof signal<string>>;
    clearMessages: ReturnType<typeof vi.fn>;
    register: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authFacade = {
      successMessage: signal(''),
      errorMessage: signal(''),
      clearMessages: vi.fn(),
      register: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        { provide: AuthFacade, useValue: authFacade }
      ]
    })
      .overrideComponent(Register, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ShouldClearMessages_WhenComponentInitializes', () => {
    expect(authFacade.clearMessages).toHaveBeenCalled();
  });

  it('ShouldSetMismatchError_WhenPasswordsAreDifferent', () => {
    component.registerForm.controls.password.setValue('Password1!');
    component.registerForm.controls.confirmPassword.setValue('Password2!');
    component.registerForm.controls.confirmPassword.markAsTouched();

    component.registerForm.updateValueAndValidity();

    expect(component.passwordMismatchMessage).toBe(Messages.PasswordsDoNotMatch);
  });

  it('ShouldReturnNullMismatchMessage_WhenConfirmationIsUntouched', () => {
    component.registerForm.controls.password.setValue('Password1!');
    component.registerForm.controls.confirmPassword.setValue('Password2!');

    expect(component.passwordMismatchMessage).toBeNull();
  });

  it('ShouldNotRegister_WhenFormIsInvalid', () => {
    component.submit();

    expect(authFacade.register).not.toHaveBeenCalled();
    expect(component.registerForm.controls.name.touched).toBe(true);
  });

  it('ShouldTrimName_WhenRegisteringValidForm', () => {
    component.registerForm.setValue({
      name: '  Mateus Bacelar  ',
      email: 'mateus@email.com',
      password: 'Password1!',
      confirmPassword: 'Password1!'
    });

    component.submit();

    expect(authFacade.register).toHaveBeenCalledWith({
      name: 'Mateus Bacelar',
      email: 'mateus@email.com',
      password: 'Password1!'
    });
  });

  it('ShouldRejectWeakPassword_WhenPasswordDoesNotMatchPattern', () => {
    component.registerForm.controls.password.setValue('weak');

    expect(component.registerForm.controls.password.invalid).toBe(true);
  });
});
