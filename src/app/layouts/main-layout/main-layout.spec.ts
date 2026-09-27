import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFacade } from '@features/auth/facades/auth.facade';
import { ProfileFacade } from '@features/profile/facades/profile.facade';

import { MainLayoutComponent } from './main-layout';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let authFacade: { logout: ReturnType<typeof vi.fn> };
  let profileFacade: {
    profile: ReturnType<typeof signal<any>>;
    loadProfile: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authFacade = {
      logout: vi.fn()
    };

    profileFacade = {
      profile: signal<any>(null),
      loadProfile: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        { provide: AuthFacade, useValue: authFacade },
        { provide: ProfileFacade, useValue: profileFacade }
      ]
    })
      .overrideComponent(MainLayoutComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
  });

  it('ShouldLoadProfile_WhenProfileIsMissingOnInit', () => {
    fixture.detectChanges();

    expect(profileFacade.loadProfile).toHaveBeenCalled();
  });

  it('ShouldNotLoadProfile_WhenProfileAlreadyExists', () => {
    profileFacade.profile.set({
      name: 'Mateus',
      email: 'mateus@email.com',
      role: null,
      area: null,
      about: null,
      createdAt: '2026-09-27T00:00:00Z'
    });

    fixture.detectChanges();

    expect(profileFacade.loadProfile).not.toHaveBeenCalled();
  });

  it('ShouldFormatFirstName_WhenProfileExists', () => {
    profileFacade.profile.set({
      name: 'mATEUS BACELAR',
      email: 'mateus@email.com',
      role: null,
      area: null,
      about: null,
      createdAt: '2026-09-27T00:00:00Z'
    });

    fixture.detectChanges();

    expect(component.userName()).toBe('Mateus');
    expect(component.userIcon()).toBe('M');
  });

  it('ShouldToggleAndCloseUserMenu_WhenMenuMethodsAreCalled', () => {
    component.toggleUserMenu();
    expect(component.isUserMenuOpen).toBe(true);

    component.closeUserMenu();
    expect(component.isUserMenuOpen).toBe(false);
  });

  it('ShouldLogout_WhenLogoutUserIsCalled', () => {
    component.logoutUser();

    expect(authFacade.logout).toHaveBeenCalled();
  });

  it('ShouldCloseMenu_WhenDocumentClickIsOutsideUserContainer', () => {
    component.isUserMenuOpen = true;

    const target = document.createElement('div');
    component.onDocumentClick({ target } as unknown as MouseEvent);

    expect(component.isUserMenuOpen).toBe(false);
  });
});
