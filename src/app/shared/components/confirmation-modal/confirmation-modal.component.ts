import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationModalComponent {

  title = input.required<string>();
  description = input.required<string>();

  confirmText = input('Confirmar');
  cancelText = input('Cancelar');

  confirm = output<void>();
  cancel = output<void>();
}
