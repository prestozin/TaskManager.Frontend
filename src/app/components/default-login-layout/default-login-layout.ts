import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-default-login-layout',
  imports: [],
  templateUrl: './default-login-layout.html',
  styleUrl: './default-login-layout.scss',
})
export class DefaultLoginLayout {
  title = input('');
  primaryButtonText = input('');
  secondaryLinkText = input('');
  primaryLinkText = input('');
  submitClicked = output<void>();

  submit(){
    this.submitClicked.emit();
  }
}
