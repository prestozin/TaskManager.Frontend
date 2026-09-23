import { Component, computed, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TokenService } from '@core/services/token/token.service';
import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { LucideChevronRight, LucideLogOut, LucideSettings, LucideUserRoundCog } from '@lucide/angular';


@Component({
  selector: 'app-main-layout',
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideChevronRight,
    LucideLogOut,
    LucideSettings,
    LucideUserRoundCog

  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})


export class MainLayoutComponent {

  private tokenService = inject(TokenService);
  private readonly profileFacade = inject(ProfileFacade);

  isUserMenuOpen = false;

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

  logoutUser() {
    this.tokenService.clear()
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    const target = event.target as HTMLElement;

    if (!target.closest('.user-container')) {
      this.isUserMenuOpen = false;
    }
  }

}
