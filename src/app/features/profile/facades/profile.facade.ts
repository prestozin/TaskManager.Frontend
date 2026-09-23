import { inject, Injectable } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { finalize } from "rxjs";
import { ChangePasswordRequest, EditProfileRequest } from "../models/profile.models";
import { ProfileState } from "../states/profile.state";
import { FeedbackService } from "@core/services/feedback/feedback.service";
import { HttpErrorResponse } from "@angular/common/http";
import { EFeedbackType } from "@shared/enums/feedback.enum";
import { getHttpErrorMessage } from "@shared/utils/http-error.util";
import { AuthFacade } from "@features/auth/facades/auth.facade";


@Injectable({
    providedIn: 'root'
})

export class ProfileFacade {

    private readonly authFacade = inject(AuthFacade);
    private readonly profileService = inject(ProfileService);
    private readonly profileState = inject(ProfileState);
    private readonly feedbackService = inject(FeedbackService);

    readonly handleError = getHttpErrorMessage;

    get profile() {
        return this.profileState.profile;
    }

    get isLoading() {
        return this.profileState.isLoading;
    }

    loadProfile(): void {
        this.profileService.getProfile()
            .pipe(finalize(() => this.profileState.isLoading.set(false)))

            .subscribe({
                next: response => {
                    if (response.isSuccess) {
                        this.profileState.profile.set(response.data);
                    }
                },

                error: (error: HttpErrorResponse) => {
                    this.handleError(error);
                    this.feedbackService.showMessage(error.message, '', EFeedbackType.Error);
                }
            });
    }

    editProfile(request: EditProfileRequest): void {
        this.profileService.editProfile(request).subscribe({
            next: response => {
                this.feedbackService.showMessage(response.message, '', EFeedbackType.Success);
                this.loadProfile();
            },
            error: (error: HttpErrorResponse) => {
                this.feedbackService.showMessage(this.handleError(error), '', EFeedbackType.Error);
            }
        })
    }

    deleteProfile(password: string): void {
        this.profileService.deleteProfile(password).subscribe({
            next: response => {
                if (!response.isSuccess) {
                    this.feedbackService.showMessage(response.message, '', EFeedbackType.Error);
                    return;
                }
                this.feedbackService.showMessage(response.message, '', EFeedbackType.Success);
                this.authFacade.logout();
            },
            error: (error: HttpErrorResponse) => {
                this.feedbackService.showMessage(this.handleError(error), '', EFeedbackType.Error);
            }
        });
    }

    changePassword(request: ChangePasswordRequest): void {
        this.profileService.changePassword(request).subscribe({
            next: response => {
                if (!response.isSuccess) {
                    this.feedbackService.showMessage(response.message, '', EFeedbackType.Error);
                    return;
                }
                this.feedbackService.showMessage(response.message, '', EFeedbackType.Success);

                setTimeout(() => {
                    this.authFacade.logout();
                }, 1500);
            },
            error: (error: HttpErrorResponse) => {
                this.feedbackService.showMessage(this.handleError(error), '', EFeedbackType.Error);
            }
        });
    }
}