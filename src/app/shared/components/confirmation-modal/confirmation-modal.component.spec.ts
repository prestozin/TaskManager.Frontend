import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationModalComponent } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent]
    })
      .overrideComponent(ConfirmationModalComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Delete task');
    fixture.componentRef.setInput('description', 'This action cannot be undone');
    fixture.detectChanges();
  });

  it('ShouldUseDefaultButtonTexts_WhenTextsAreNotProvided', () => {
    expect(component.confirmText()).toBe('Confirmar');
    expect(component.cancelText()).toBe('Cancelar');
  });

  it('ShouldEmitConfirm_WhenConfirmOutputIsTriggered', () => {
    const emitted = vi.fn();
    component.confirm.subscribe(emitted);

    component.confirm.emit();

    expect(emitted).toHaveBeenCalled();
  });

  it('ShouldEmitCancel_WhenCancelOutputIsTriggered', () => {
    const emitted = vi.fn();
    component.cancel.subscribe(emitted);

    component.cancel.emit();

    expect(emitted).toHaveBeenCalled();
  });
});
