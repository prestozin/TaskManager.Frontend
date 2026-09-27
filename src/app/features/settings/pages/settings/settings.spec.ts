import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NzModalService } from 'ng-zorro-antd/modal';

import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { TaskFacade } from '@features/tasks/facades/task.facade';
import { Messages } from '@shared/constants/messages';

import { Settings } from './settings';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;
  let profileFacade: {
    changePassword: ReturnType<typeof vi.fn>;
    deleteProfile: ReturnType<typeof vi.fn>;
  };
  let taskFacade: {
    confirmBeforeDelete: ReturnType<typeof signal<boolean>>;
    pageSize: ReturnType<typeof signal<number>>;
    setConfirmBeforeDelete: ReturnType<typeof vi.fn>;
    setPageSize: ReturnType<typeof vi.fn>;
  };
  let modal: { confirm: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    profileFacade = {
      changePassword: vi.fn(),
      deleteProfile: vi.fn()
    };

    taskFacade = {
      confirmBeforeDelete: signal(true),
      pageSize: signal(10),
      setConfirmBeforeDelete: vi.fn(),
      setPageSize: vi.fn()
    };

    modal = {
      confirm: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [Settings],
      providers: [
        { provide: ProfileFacade, useValue: profileFacade },
        { provide: TaskFacade, useValue: taskFacade }
      ]
    });

    TestBed.overrideProvider(NzModalService, { useValue: modal });
    TestBed.overrideComponent(Settings, { set: { template: '' } });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ShouldOpenAndCloseChangePassword_WhenToggleIsCalled', () => {
    component.toggleChangePassword();
    expect(component.isChangePasswordOpen()).toBe(true);

    component.currentPassword.setValue('OldPassword1!');
    component.toggleChangePassword();

    expect(component.isChangePasswordOpen()).toBe(false);
    expect(component.currentPassword.value).toBe('');
  });

  it('ShouldDetectPasswordMismatch_WhenConfirmationDiffers', () => {
    component.newPassword.setValue('NewPassword1!');
    component.confirmNewPassword.setValue('OtherPassword1!');
    component.confirmNewPassword.markAsTouched();

    expect(component.passwordsMismatch).toBe(true);
    expect(component.confirmPasswordError).toBe(Messages.PasswordsDoNotMatch);
  });

  it('ShouldNotChangePassword_WhenPasswordFormIsInvalid', () => {
    component.confirmChangePassword();

    expect(profileFacade.changePassword).not.toHaveBeenCalled();
    expect(component.currentPassword.touched).toBe(true);
  });

  it('ShouldChangePassword_WhenPasswordFormIsValid', () => {
    component.currentPassword.setValue('OldPassword1!');
    component.newPassword.setValue('NewPassword1!');
    component.confirmNewPassword.setValue('NewPassword1!');

    component.confirmChangePassword();

    expect(profileFacade.changePassword).toHaveBeenCalledWith({
      oldPassword: 'OldPassword1!',
      newPassword: 'NewPassword1!'
    });
  });

  it('ShouldTogglePasswordVisibility_WhenVisibilityMethodsAreCalled', () => {
    component.toggleCurrentPasswordVisibility();
    component.toggleNewPasswordVisibility();
    component.toggleConfirmPasswordVisibility();
    component.toggleDeletePasswordVisibility();

    expect(component.currentPasswordView().type).toBe('text');
    expect(component.newPasswordView().type).toBe('text');
    expect(component.confirmPasswordView().type).toBe('text');
    expect(component.deletePasswordView().type).toBe('text');
  });

  it('ShouldOpenDeleteConfirmation_WhenPasswordIsValid', () => {
    component.deletePassword.setValue('Password1!');

    component.openDeleteConfirmation();

    expect(modal.confirm).toHaveBeenCalled();

    const config = modal.confirm.mock.calls[0][0];
    config.nzOnOk();

    expect(profileFacade.deleteProfile).toHaveBeenCalledWith('Password1!');
  });

  it('ShouldNotOpenDeleteConfirmation_WhenPasswordIsInvalid', () => {
    component.openDeleteConfirmation();

    expect(modal.confirm).not.toHaveBeenCalled();
  });

  it('ShouldForwardTaskSettings_WhenSettingsChange', () => {
    component.setConfirmBeforeDelete(false);
    component.selectTaskPageSize(30);

    expect(taskFacade.setConfirmBeforeDelete).toHaveBeenCalledWith(false);
    expect(taskFacade.setPageSize).toHaveBeenCalledWith(30);
  });

  it('ShouldClosePageSizeSelect_WhenOverlaysAreClosed', () => {
    component.setPageSizeSelectOpen(true);

    component.closeOverlays();

    expect(component.isPageSizeSelectOpen()).toBe(false);
  });
});
