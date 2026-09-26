import { Component, computed, HostListener, inject, OnInit, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NzIconModule } from 'ng-zorro-antd/icon';

import { AuthFacade } from '@features/auth/facades/auth.facade';
import { ProfileFacade } from '@features/profile/facades/profile.facade';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterLink,
    RouterLinkActive,
    NzIconModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent implements OnInit {

  private readonly authFacade = inject(AuthFacade);
  private readonly profileFacade = inject(ProfileFacade);

  readonly contentScroll = output<void>();

  isUserMenuOpen = false;

  readonly userName = computed(() => {
    const name = this.profileFacade.profile()?.name ?? '';

    if (!name)
      return '';

    const firstName = name.trim().split(' ')[0];

    return firstName.charAt(0).toUpperCase() +
      firstName.slice(1).toLowerCase();
  });

  readonly userIcon = computed(() =>
    this.userName().charAt(0)
  );

  ngOnInit(): void {
    if (!this.profileFacade.profile())
      this.profileFacade.loadProfile();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  logoutUser(): void {
    this.authFacade.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.user-container'))
      this.closeUserMenu();
  }
}
