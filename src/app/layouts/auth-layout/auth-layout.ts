import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [
    RouterLink
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})

export class AuthLayoutComponent {

  title = input('');
  primaryButtonText = input('');
  submitClicked = output<void>();

  isLoading = input(false);

  submit() {
    if (this.isLoading()) return;
    this.submitClicked.emit();
  }
}
