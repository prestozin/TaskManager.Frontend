import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';


import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout';
import { InputFormsComponent } from '@shared/components/input-forms/input-forms';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        NzIconModule,
        NzModalModule,
        NzSelectModule,
        NzSwitchModule,
        MainLayoutComponent,
        InputFormsComponent
    ],
    templateUrl: './settings.html',
    styleUrl: './settings.scss'
})
export class Settings implements AfterViewInit, OnDestroy {

    private readonly document = inject(DOCUMENT);
    private readonly modal = inject(NzModalService);
    private readonly profileFacade = inject(ProfileFacade);

    private scrollContainer: Element | null = null;

    confirmTaskDelete = true;
    taskPageSize = 10;

    readonly isDeleteAccountOpen = signal(false);
    readonly isPageSizeSelectOpen = signal(false);

    readonly deletePassword = new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
    });

    private readonly closePageSizeSelect = () => {
        this.isPageSizeSelectOpen.set(false);
    };

    ngAfterViewInit(): void {
        this.scrollContainer = this.document.querySelector('.body-content');

        this.scrollContainer?.addEventListener(
            'scroll',
            this.closePageSizeSelect
        );
    }

    ngOnDestroy(): void {
        this.scrollContainer?.removeEventListener(
            'scroll',
            this.closePageSizeSelect
        );
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
    }

    openDeleteConfirmation(): void {
        if (this.deletePassword.invalid) {
            this.deletePassword.markAsTouched();
            return;
        }

        this.modal.confirm({
            nzTitle: 'Excluir conta',
            nzContent: 'Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.',
            nzOkText: 'Excluir conta',
            nzCancelText: 'Cancelar',
            nzOkDanger: true,
            nzOnOk: () => this.confirmDeleteAccount()
        });
    }

    private confirmDeleteAccount(): void {
        this.profileFacade.deleteProfile(
            this.deletePassword.value
        );
    }
}