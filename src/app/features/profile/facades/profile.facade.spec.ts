import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { FeedbackService } from '@core/services/feedback/feedback.service';
import { AuthFacade } from '@features/auth/facades/auth.facade';
import { ProfileService } from '@features/profile/services/profile.service';
import { ProfileState } from '@features/profile/states/profile.state';
import { EFeedbackType } from '@shared/enums/feedback.enum';

import { ProfileFacade } from './profile.facade';

describe('ProfileFacade', () => {
  let facade: ProfileFacade;
  let state: ProfileState;
  let profileService: {
    getProfile: ReturnType<typeof vi.fn>;
    editProfile: ReturnType<typeof vi.fn>;
    deleteProfile: ReturnType<typeof vi.fn>;
    changePassword: ReturnType<typeof vi.fn>;
  };
  let feedbackService: { showMessage: ReturnType<typeof vi.fn> };
  let authFacade: { logout: ReturnType<typeof vi.fn> };

  const profile = {
    name: 'User',
    email: 'user@email.com',
    role: 'Developer',
    area: 'Software',
    about: null,
    createdAt: '2026-09-27T00:00:00Z'
  };

  beforeEach(() => {
    vi.useFakeTimers();

    profileService = {
      getProfile: vi.fn(),
      editProfile: vi.fn(),
      deleteProfile: vi.fn(),
      changePassword: vi.fn()
    };

    feedbackService = {
      showMessage: vi.fn()
    };

    authFacade = {
      logout: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ProfileFacade,
        ProfileState,
        { provide: ProfileService, useValue: profileService },
        { provide: FeedbackService, useValue: feedbackService },
        { provide: AuthFacade, useValue: authFacade }
      ]
    });

    facade = TestBed.inject(ProfileFacade);
    state = TestBed.inject(ProfileState);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ShouldStoreProfile_WhenLoadProfileSucceeds', () => {
    profileService.getProfile.mockReturnValue(of({
      isSuccess: true,
      message: 'Success',
      data: profile
    }));

    facade.loadProfile();

    expect(state.profile()).toEqual(profile);
    expect(state.isLoading()).toBe(false);
  });

  it('ShouldShowError_WhenLoadProfileFailsByHttp', () => {
    const error = new HttpErrorResponse({
      error: {
        isSuccess: false,
        message: 'Profile error',
        data: null
      }
    });

    profileService.getProfile.mockReturnValue(throwError(() => error));

    facade.loadProfile();

    expect(feedbackService.showMessage).toHaveBeenCalledWith(
      'Profile error',
      '',
      EFeedbackType.Error
    );
    expect(state.isLoading()).toBe(false);
  });

  it('ShouldReloadProfile_WhenEditProfileSucceeds', () => {
    profileService.editProfile.mockReturnValue(of({
      isSuccess: true,
      message: 'Updated',
      data: null
    }));

    profileService.getProfile.mockReturnValue(of({
      isSuccess: true,
      message: 'Success',
      data: profile
    }));

    facade.editProfile({
      name: 'User',
      role: null,
      area: null,
      about: null
    });

    expect(feedbackService.showMessage).toHaveBeenCalledWith(
      'Updated',
      '',
      EFeedbackType.Success
    );
    expect(profileService.getProfile).toHaveBeenCalled();
  });

  it('ShouldNotReloadProfile_WhenEditProfileResponseFails', () => {
    profileService.editProfile.mockReturnValue(of({
      isSuccess: false,
      message: 'Failed',
      data: null
    }));

    facade.editProfile({
      name: 'User',
      role: null,
      area: null,
      about: null
    });

    expect(profileService.getProfile).not.toHaveBeenCalled();
  });

  it('ShouldLogout_WhenDeleteProfileSucceeds', () => {
    profileService.deleteProfile.mockReturnValue(of({
      isSuccess: true,
      message: 'Deleted',
      data: null
    }));

    facade.deleteProfile('Password1!');

    expect(feedbackService.showMessage).toHaveBeenCalledWith(
      'Deleted',
      '',
      EFeedbackType.Success
    );
    expect(authFacade.logout).toHaveBeenCalled();
  });

  it('ShouldNotLogout_WhenDeleteProfileResponseFails', () => {
    profileService.deleteProfile.mockReturnValue(of({
      isSuccess: false,
      message: 'Wrong password',
      data: null
    }));

    facade.deleteProfile('wrong');

    expect(feedbackService.showMessage).toHaveBeenCalledWith(
      'Wrong password',
      '',
      EFeedbackType.Error
    );
    expect(authFacade.logout).not.toHaveBeenCalled();
  });

  it('ShouldLogoutAfterDelay_WhenChangePasswordSucceeds', () => {
    profileService.changePassword.mockReturnValue(of({
      isSuccess: true,
      message: 'Password changed',
      data: null
    }));

    facade.changePassword({
      oldPassword: 'OldPassword1!',
      newPassword: 'NewPassword1!'
    });

    expect(authFacade.logout).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1500);

    expect(authFacade.logout).toHaveBeenCalled();
  });
});
