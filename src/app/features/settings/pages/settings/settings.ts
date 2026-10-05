import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { TaskFacade } from '@features/tasks/facades/task.facade';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout';
import {
    PASSWORD_MAX_LENGTH,
    PASSWORD_PATTERN,
    TASK_PAGE_SIZE_OPTIONS,
} from '@shared/constants/constants';
import { Messages } from '@shared/constants/messages';
import { getFormControlErrorMessage } from '@shared/utils/form-error.util';

@Component({
    selector: 'app-settings',
    imports: [
        MainLayoutComponent,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        NzIconModule,
        NzModalModule,
        NzSelectModule,
        NzSwitchModule
    ],
    templateUrl: './settings.html',
    styleUrl: './settings.scss'
})
export class Settings {

    private readonly modal = inject(NzModalService);
    private readonly profileFacade = inject(ProfileFacade);
    private readonly taskFacade = inject(TaskFacade);

    readonly confirmBeforeDelete = this.taskFacade.confirmBeforeDelete;
    readonly taskPageSize = this.taskFacade.pageSize;
    readonly pageSizeOptions = TASK_PAGE_SIZE_OPTIONS;

    readonly isDeleteAccountOpen = signal(false);
    readonly isChangePasswordOpen = signal(false);
    readonly isPageSizeSelectOpen = signal(false);

    readonly showCurrentPassword = signal(false);
    readonly showNewPassword = signal(false);
    readonly showConfirmPassword = signal(false);
    readonly showDeletePassword = signal(false);


    get currentPasswordError(): string | null {
        return getFormControlErrorMessage(this.currentPassword);
    }

    get newPasswordError(): string | null {
        return getFormControlErrorMessage(this.newPassword);
    }

    get confirmPasswordError(): string | null {
        const controlError = getFormControlErrorMessage(this.confirmNewPassword);

        if (controlError)
            return controlError;

        if (this.passwordsMismatch)
            return Messages.PasswordsDoNotMatch;

        return null;
    }

    get deletePasswordError(): string | null {
        return getFormControlErrorMessage(this.deletePassword);
    }

    get passwordsMismatch(): boolean {
        return (
            this.confirmNewPassword.touched &&
            !!this.newPassword.value &&
            !!this.confirmNewPassword.value &&
            this.newPassword.value !== this.confirmNewPassword.value
        );
    }

    readonly deletePassword = new FormControl('', {
        nonNullable: true,
        validators: [
            Validators.required,
            Validators.maxLength(PASSWORD_MAX_LENGTH)
        ]
    });

    readonly currentPassword = new FormControl('', {
        nonNullable: true,
        validators: [
            Validators.required,
            Validators.maxLength(PASSWORD_MAX_LENGTH)
        ]
    });

    readonly newPassword = new FormControl('', {
        nonNullable: true,
        validators: [
            Validators.required,
            Validators.pattern(PASSWORD_PATTERN)
        ]
    });

    readonly confirmNewPassword = new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
    });

    readonly currentPasswordView = computed(() =>
        this.getPasswordFieldView(this.showCurrentPassword())
    );

    readonly newPasswordView = computed(() =>
        this.getPasswordFieldView(this.showNewPassword())
    );

    readonly confirmPasswordView = computed(() =>
        this.getPasswordFieldView(this.showConfirmPassword())
    );

    readonly deletePasswordView = computed(() =>
        this.getPasswordFieldView(this.showDeletePassword())
    );

    toggleChangePassword(): void {
        if (this.isChangePasswordOpen()) {
            this.closeChangePassword();
            return;
        }

        this.isChangePasswordOpen.set(true);
    }

    closeChangePassword(): void {
        this.isChangePasswordOpen.set(false);

        this.currentPassword.reset();
        this.newPassword.reset();
        this.confirmNewPassword.reset();

        this.showCurrentPassword.set(false);
        this.showNewPassword.set(false);
        this.showConfirmPassword.set(false);
    }

    toggleCurrentPasswordVisibility(): void {
        this.showCurrentPassword.update(value => !value);
    }

    toggleNewPasswordVisibility(): void {
        this.showNewPassword.update(value => !value);
    }

    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword.update(value => !value);
    }

    confirmChangePassword(): void {
        if (this.currentPassword.invalid ||
            this.newPassword.invalid ||
            this.confirmNewPassword.invalid) {
            this.currentPassword.markAsTouched();
            this.newPassword.markAsTouched();
            this.confirmNewPassword.markAsTouched();

            return;
        }

        if (this.passwordsMismatch) {
            this.confirmNewPassword.markAsTouched();
            return;
        }

        this.profileFacade.changePassword({
            oldPassword: this.currentPassword.value,
            newPassword: this.newPassword.value
        });
    }

    toggleDeleteAccount(): void {
        if (this.isDeleteAccountOpen()) {
            this.closeDeleteAccount();
            return;
        }

        this.isDeleteAccountOpen.set(true);
    }

    closeDeleteAccount(): void {
        this.isDeleteAccountOpen.set(false);
        this.deletePassword.reset();
        this.showDeletePassword.set(false);
    }

    toggleDeletePasswordVisibility(): void {
        this.showDeletePassword.update(value => !value);
    }

    openDeleteConfirmation(): void {
        if (this.deletePassword.invalid) {
            this.deletePassword.markAsTouched();
            return;
        }

        this.modal.confirm({
            nzTitle: Messages.DeleteAccountTitle,
            nzContent: Messages.DeleteAccountConfirmation,
            nzOkText: Messages.DeleteAccountConfirmButton,
            nzCancelText: Messages.CancelButton,
            nzOkDanger: true,
            nzOnOk: () => this.confirmDeleteAccount()
        });
    }

    setConfirmBeforeDelete(confirmBeforeDelete: boolean): void {
        this.taskFacade.setConfirmBeforeDelete(confirmBeforeDelete);
    }

    selectTaskPageSize(pageSize: number): void {
        this.taskFacade.setPageSize(pageSize);
    }

    setPageSizeSelectOpen(isOpen: boolean): void {
        this.isPageSizeSelectOpen.set(isOpen);
    }

    closeOverlays(): void {
        this.isPageSizeSelectOpen.set(false);
    }

    private confirmDeleteAccount(): void {
        this.profileFacade.deleteProfile(this.deletePassword.value);
    }

    private getPasswordFieldView(isVisible: boolean) {
        return {
            type: isVisible ? 'text' : 'password',
            icon: isVisible ? 'eye-invisible' : 'eye'
        };
    }
}
