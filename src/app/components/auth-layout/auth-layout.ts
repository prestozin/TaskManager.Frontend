import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  imports: [],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})

export class AuthLayoutComponent {
  title = input('');
  primaryButtonText = input('');
  textLink = input('');
  submitClicked = output<void>();

  submit(){
    this.submitClicked.emit();
  }
}
