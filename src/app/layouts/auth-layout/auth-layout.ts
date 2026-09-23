import { Component, input, output } from '@angular/core';

import { LucideChartNoAxesColumnIncreasing, LucideClock3, LucideListChecks } from '@lucide/angular';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-auth-layout',
  imports: [
    NzButtonModule,
    LucideChartNoAxesColumnIncreasing,
    LucideListChecks,
    LucideClock3
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayoutComponent {

  title = input('');
  primaryButtonText = input('');
  isLoading = input(false);

  submitClicked = output<void>();

  submit(): void {
    if (this.isLoading()) {
      return;
    }

    this.submitClicked.emit();
  }
}