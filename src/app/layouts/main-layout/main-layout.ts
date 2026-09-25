import { Component, computed, HostListener, inject, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { TokenService } from '@core/services/token/token.service';

import { ProfileFacade } from '@features/profile/facades/profile.facade';

import { NzIconModule } from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-main-layout',
  imports: [
    RouterLink,
    RouterLinkActive,
    NzIconModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})


export class MainLayoutComponent {

  private readonly tokenService = inject(TokenService);
  private readonly profileFacade = inject(ProfileFacade);
  private readonly router = inject(Router);

  isUserMenuOpen = false;

  readonly contentScroll = output<void>();


  readonly userName = computed(() => {
    const name = this.profileFacade.profile()?.name ?? '';

    if (!name) return '';

    const firstName = name.trim().split(' ')[0];

    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  });

  readonly userIcon = computed(() => {
    return this.userName().charAt(0);
  });


  ngOnInit() {
    this.profileFacade.loadProfile();
  }


  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }

  logoutUser() {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    const target = event.target as HTMLElement;

    if (!target.closest('.user-container')) {
      this.isUserMenuOpen = false;
    }
  }

}