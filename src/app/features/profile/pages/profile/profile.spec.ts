import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFacade } from '@features/profile/facades/profile.facade';

import { Profile } from './profile';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let profileSignal: ReturnType<typeof signal<any>>;
  let profileFacade: {
    profile: ReturnType<typeof signal<any>>;
    isLoading: ReturnType<typeof signal<boolean>>;
    editProfile: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    profileSignal = signal({
      name: 'mateus bacelar',
      email: 'mateus@email.com',
      role: 'developer',
      area: null,
      about: 'About',
      createdAt: '2026-09-27T00:00:00Z'
    });

    profileFacade = {
      profile: profileSignal,
      isLoading: signal(false),
      editProfile: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        { provide: ProfileFacade, useValue: profileFacade }
      ]
    })
      .overrideComponent(Profile, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ShouldPopulateForm_WhenProfileIsAvailable', () => {
    expect(component.profileForm.getRawValue()).toEqual({
      name: 'mateus bacelar',
      role: 'developer',
      area: '',
      about: 'About'
    });
  });

  it('ShouldFormatDisplayValues_WhenProfileIsAvailable', () => {
    expect(component.userInitial()).toBe('M');
    expect(component.userName()).toBe('Mateus Bacelar');
    expect(component.userRole()).toBe('Developer');
  });

  it('ShouldReturnFallbackRole_WhenRoleIsMissing', () => {
    profileSignal.set({
      ...profileSignal(),
      role: null
    });

    fixture.detectChanges();

    expect(component.userRole()).toBe('Cargo não informado');
  });

  it('ShouldNotEditProfile_WhenFormIsInvalid', () => {
    component.profileForm.controls.name.setValue('');

    component.editProfile();

    expect(profileFacade.editProfile).not.toHaveBeenCalled();
    expect(component.profileForm.controls.name.touched).toBe(true);
  });

  it('ShouldTrimAndNormalizeOptionalFields_WhenEditingProfile', () => {
    component.profileForm.setValue({
      name: '  Mateus Bacelar  ',
      role: '  Developer  ',
      area: '   ',
      about: '  About me  '
    });

    component.editProfile();

    expect(profileFacade.editProfile).toHaveBeenCalledWith({
      name: 'Mateus Bacelar',
      role: 'Developer',
      area: null,
      about: 'About me'
    });
  });

  it('ShouldReturnAboutCharacterCount_WhenAboutChanges', () => {
    component.profileForm.controls.about.setValue('12345');

    expect(component.aboutCharacterCount).toBe(5);
  });
});
