import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  imports: [],
  templateUrl: './loading-button.component.html',
  styleUrl: './loading-button.component.scss',
})
export class LoadingButtonComponent {

  text = input.required<string>();

  isLoading = input<boolean>(false);

  submitClicked = output<void>();
}
