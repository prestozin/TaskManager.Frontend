import { FormControl, Validators } from '@angular/forms';

import { Messages } from '@shared/constants/messages';

import { getFormControlErrorMessage } from './form-error.util';

describe('form-error.util', () => {
  it('ShouldReturnNull_WhenControlIsUntouched', () => {
    const control = new FormControl('', Validators.required);

    expect(getFormControlErrorMessage(control)).toBeNull();
  });

  it('ShouldReturnRequiredMessage_WhenRequiredValidationFails', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();

    expect(getFormControlErrorMessage(control)).toBe(Messages.RequiredField);
  });

  it('ShouldReturnEmailMessage_WhenEmailValidationFails', () => {
    const control = new FormControl('invalid', Validators.email);
    control.markAsTouched();

    expect(getFormControlErrorMessage(control)).toBe(Messages.InvalidEmail);
  });

  it('ShouldReturnMinimumLengthMessage_WhenMinimumLengthValidationFails', () => {
    const control = new FormControl('a', Validators.minLength(3));
    control.markAsTouched();

    expect(getFormControlErrorMessage(control)).toBe(Messages.minimumLength(3));
  });

  it('ShouldReturnMaximumLengthMessage_WhenMaximumLengthValidationFails', () => {
    const control = new FormControl('abcd', Validators.maxLength(3));
    control.markAsTouched();

    expect(getFormControlErrorMessage(control)).toBe(Messages.maximumLength(3));
  });

  it('ShouldReturnPasswordRules_WhenPatternValidationFails', () => {
    const control = new FormControl('abc', Validators.pattern(/\d/));
    control.markAsTouched();

    expect(getFormControlErrorMessage(control)).toBe(Messages.PasswordRules);
  });

  it('ShouldReturnNull_WhenTouchedControlIsValid', () => {
    const control = new FormControl('valid', Validators.required);
    control.markAsTouched();

    expect(getFormControlErrorMessage(control)).toBeNull();
  });
});
