import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { ProfileFacade } from '@features/profile/facades/profile.facade';

import { EditProfileRequest } from '@features/profile/models/profile.models';

import { MainLayoutComponent } from '@layouts/main-layout/main-layout';
import { InputFormsComponent } from '@shared/components/input-forms/input-forms';

import {
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PROFILE_ABOUT_MAX_LENGTH,
  PROFILE_AREA_MAX_LENGTH,
  PROFILE_ROLE_MAX_LENGTH
} from '@shared/constants/constants';

import { capitalizeFirst } from '@shared/utils/string/string.util';

@Component({
  selector: 'app-profile',
  imports: [
    MainLayoutComponent,
    InputFormsComponent,
    ReactiveFormsModule,
    DatePipe,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  private readonly profileFacade = inject(ProfileFacade);

  readonly profile = this.profileFacade.profile;

  readonly nameMaxLength = NAME_MAX_LENGTH;
  readonly roleMaxLength = PROFILE_ROLE_MAX_LENGTH;
  readonly areaMaxLength = PROFILE_AREA_MAX_LENGTH;
  readonly aboutMaxLength = PROFILE_ABOUT_MAX_LENGTH;

  readonly profileForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(NAME_MIN_LENGTH),
        Validators.maxLength(NAME_MAX_LENGTH)
      ]
    }),

    role: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(PROFILE_ROLE_MAX_LENGTH)
      ]
    }),

    area: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(PROFILE_AREA_MAX_LENGTH)
      ]
    }),

    about: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(PROFILE_ABOUT_MAX_LENGTH)
      ]
    })
  });

  readonly userInitial = computed(() =>
    this.profile()?.name.charAt(0).toUpperCase() ?? ''
  );

  readonly userName = computed(() =>
    this.formatDisplayName(this.profile()?.name ?? '')
  );

  readonly userRole = computed(() => {
    const role = this.profile()?.role;

    return role ? capitalizeFirst(role) : 'Cargo não informado';
  });

  private readonly profileEffect = effect(() => {
    const profile = this.profile();

    if (!profile)
      return;

    this.profileForm.patchValue({
      name: profile.name,
      role: profile.role ?? '',
      area: profile.area ?? '',
      about: profile.about ?? ''
    });
  });

  get aboutCharacterCount(): number {
    return this.profileForm.controls.about.value.length;
  }

  editProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValue = this.profileForm.getRawValue();

    const request: EditProfileRequest = {
      name: formValue.name.trim(),
      role: formValue.role.trim() || null,
      area: formValue.area.trim() || null,
      about: formValue.about.trim() || null
    };

    this.profileFacade.editProfile(request);
  }

  private formatDisplayName(name: string): string {
    if (!name)
      return '';

    const names = name.trim().split(/\s+/);

    if (names.length === 1)
      return capitalizeFirst(names[0]);

    return `${capitalizeFirst(names[0])} ${capitalizeFirst(names[names.length - 1])}`;
  }
}
