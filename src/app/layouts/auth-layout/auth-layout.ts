import { Component, input, output } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-auth-layout',
  imports: [
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayoutComponent {

  readonly title = input.required<string>();
  readonly primaryButtonText = input.required<string>();
  readonly isLoading = input(false);

  readonly submitClicked = output<void>();

  submit(): void {
    if (this.isLoading())
      return;

    this.submitClicked.emit();
  }
}
