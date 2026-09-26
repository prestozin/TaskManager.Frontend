import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize } from 'rxjs';

import { FeedbackService } from '@core/services/feedback/feedback.service';
import { AuthFacade } from '@features/auth/facades/auth.facade';
import {
    ChangePasswordRequest,
    EditProfileRequest
} from '@features/profile/models/profile.models';
import { ProfileService } from '@features/profile/services/profile.service';
import { ProfileState } from '@features/profile/states/profile.state';
import { EFeedbackType } from '@shared/enums/feedback.enum';
import { getHttpErrorMessage } from '@shared/utils/http-error.util';

@Injectable({
    providedIn: 'root'
})
export class ProfileFacade {

    private readonly authFacade = inject(AuthFacade);
    private readonly profileService = inject(ProfileService);
    private readonly profileState = inject(ProfileState);
    private readonly feedbackService = inject(FeedbackService);

    get profile() {
        return this.profileState.profile;
    }

    get isLoading() {
        return this.profileState.isLoading;
    }

    loadProfile(): void {
        this.profileState.isLoading.set(true);

        this.profileService.getProfile()
            .pipe(
                finalize(() => this.profileState.isLoading.set(false))
            )
            .subscribe({
                next: response => {
                    if (!response.isSuccess)
                        return;

                    this.profileState.profile.set(response.data);
                },

                error: (error: HttpErrorResponse) => {
                    this.feedbackService.showMessage(
                        getHttpErrorMessage(error),
                        '',
                        EFeedbackType.Error
                    );
                }
            });
    }

    editProfile(request: EditProfileRequest): void {
        this.profileState.isLoading.set(true);

        this.profileService.editProfile(request).subscribe({
            next: response => {
                this.feedbackService.showMessage(
                    response.message,
                    '',
                    EFeedbackType.Success
                );

                this.loadProfile();
            },

            error: (error: HttpErrorResponse) => {
                this.profileState.isLoading.set(false);

                this.feedbackService.showMessage(
                    getHttpErrorMessage(error),
                    '',
                    EFeedbackType.Error
                );
            }
        });
    }

    deleteProfile(password: string): void {
        this.profileService.deleteProfile(password).subscribe({
            next: response => {
                if (!response.isSuccess) {
                    this.feedbackService.showMessage(
                        response.message,
                        '',
                        EFeedbackType.Error
                    );

                    return;
                }

                this.feedbackService.showMessage(
                    response.message,
                    '',
                    EFeedbackType.Success
                );

                this.authFacade.logout();
            },

            error: (error: HttpErrorResponse) => {
                this.feedbackService.showMessage(
                    getHttpErrorMessage(error),
                    '',
                    EFeedbackType.Error
                );
            }
        });
    }

    changePassword(request: ChangePasswordRequest): void {
        this.profileService.changePassword(request).subscribe({
            next: response => {
                if (!response.isSuccess) {
                    this.feedbackService.showMessage(
                        response.message,
                        '',
                        EFeedbackType.Error
                    );

                    return;
                }

                this.feedbackService.showMessage(
                    response.message,
                    '',
                    EFeedbackType.Success
                );

                setTimeout(() => {
                    this.authFacade.logout();
                }, 1500);
            },

            error: (error: HttpErrorResponse) => {
                this.feedbackService.showMessage(
                    getHttpErrorMessage(error),
                    '',
                    EFeedbackType.Error
                );
            }
        });
    }
}
