import { Component, HostListener, inject, input } from '@angular/core';
import { TaskContainerComponent } from "../task-container/task-container";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent {

  private tokenService = inject(TokenService);

  userName = '';
  userIcon = '';
  isUserMenuOpen = false;

  ngOnInit(){
    const name =  this.tokenService.getName() ?? '';
    this.userName = name.trim().split(' ')[0].toLowerCase();
    this.userName = this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
    this.userIcon = this.userName.charAt(0);
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent){
    
    const target = event.target as HTMLElement;

    if (!target.closest('.user-container')) {
      this.isUserMenuOpen = false;
    }
  }

}
