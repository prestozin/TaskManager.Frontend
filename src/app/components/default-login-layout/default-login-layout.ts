import { Component, input } from '@angular/core';

@Component({
  selector: 'app-default-login-layout',
  imports: [],
  templateUrl: './default-login-layout.html',
  styleUrl: './default-login-layout.scss',
})
export class DefaultLoginLayout {
  title = input('');
  primaryButtonText = input('');
  secondaryButtonText = input('');
}
