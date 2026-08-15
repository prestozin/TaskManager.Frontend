import { Component, HostListener, input } from '@angular/core';
import { TaskContainerComponent } from "../task-container/task-container";
import { RouterLink, RouterLinkActive } from "@angular/router";

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

  title = input('');
  username = input('');
  isUserMenuOpen = false;

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
