import { HttpErrorResponse } from '@angular/common/http';

import { Messages } from '@shared/constants/messages';

import { getHttpErrorMessage } from './http-error.util';

describe('http-error.util', () => {
  it('ShouldReturnFirstValidationError_WhenErrorsExist', () => {
    const error = new HttpErrorResponse({
      error: {
        isSuccess: false,
        message: 'Validation failed',
        data: null,
        errors: ['First error', 'Second error']
      }
    });

    expect(getHttpErrorMessage(error)).toBe('First error');
  });

  it('ShouldReturnResponseMessage_WhenErrorsDoNotExist', () => {
    const error = new HttpErrorResponse({
      error: {
        isSuccess: false,
        message: 'Request failed',
        data: null
      }
    });

    expect(getHttpErrorMessage(error)).toBe('Request failed');
  });

  it('ShouldReturnUnexpectedMessage_WhenResponseDoesNotContainMessage', () => {
    const error = new HttpErrorResponse({ error: null });

    expect(getHttpErrorMessage(error)).toBe(Messages.UnexpectedError);
  });
});
