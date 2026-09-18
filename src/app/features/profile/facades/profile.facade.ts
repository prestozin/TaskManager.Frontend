import { inject, Injectable } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { ResultResponse } from "@shared/models/response.models";
import { finalize, Observable } from "rxjs";
import { ProfileResponse } from "../models/profile.models";
import { ProfileState } from "../states/profile.state";
import { FeedbackService } from "@core/services/feedback/feedback.service";
import { HttpErrorResponse } from "@angular/common/http";
import { EFeedbackType } from "@shared/enums/feedback.enum";
import { getHttpErrorMessage } from "@shared/utils/http-error.util";


@Injectable({
    providedIn: 'root'
})

export class ProfileFacade {

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
}