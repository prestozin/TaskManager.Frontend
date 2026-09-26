import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {

  readonly title = input.required<string>();
  readonly description = input.required<string>();

  readonly confirmText = input('Confirmar');
  readonly cancelText = input('Cancelar');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
