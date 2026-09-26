import { AbstractControl } from '@angular/forms';

import { Messages } from '@shared/constants/messages';

export function getFormControlErrorMessage(control: AbstractControl): string | null {
    if (!control.touched || !control.invalid)
        return null;

    if (control.hasError('required'))
        return Messages.RequiredField;

    if (control.hasError('email'))
        return Messages.InvalidEmail;

    const minLength = control.getError('minlength');

    if (minLength)
        return Messages.minimumLength(minLength.requiredLength);

    const maxLength = control.getError('maxlength');

    if (maxLength)
        return Messages.maximumLength(maxLength.requiredLength);

    return null;
}
