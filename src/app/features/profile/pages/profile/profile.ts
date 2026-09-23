import { DatePipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';

import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { EditProfileRequest } from '@features/profile/models/profile.models';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout';
import { InputFormsComponent } from '@shared/components/input-forms/input-forms';
import { capitalizeFirst } from '@shared/utils/string.util';

@Component({
  selector: 'app-profile',
  imports: [
    MainLayoutComponent,
    InputFormsComponent,
    ReactiveFormsModule,
    NzButtonModule,
    DatePipe
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  private readonly profileFacade = inject(ProfileFacade);

  readonly capitalizeFirst = capitalizeFirst;

  readonly profile = this.profileFacade.profile;
  readonly isLoading = this.profileFacade.isLoading;

  readonly profileForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    role: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(50)] }),
    area: new FormControl('', { nonNullable: true }),
    about: new FormControl('', { nonNullable: true })
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

  displayName(name: string): string {
    const names = name.trim().split(/\s+/);

    if (names.length === 1)
      return capitalizeFirst(names[0]);

    return `${capitalizeFirst(names[0])} ${capitalizeFirst(names[names.length - 1])}`;
  }

  editProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const request: EditProfileRequest = this.profileForm.getRawValue();

    this.profileFacade.editProfile(request);
  }
}