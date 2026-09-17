import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideChartNoAxesColumnIncreasing, LucideClock3, LucideListChecks } from '@lucide/angular';
import { LoadingButtonComponent } from '@shared/components/loading-button/loading-button.component';

@Component({
  selector: 'app-auth-layout',
  imports: [
    LoadingButtonComponent,
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
  submitClicked = output<void>();

  isLoading = input(false);

  submit() {
    if (this.isLoading()) return;
    this.submitClicked.emit();
  }
}
