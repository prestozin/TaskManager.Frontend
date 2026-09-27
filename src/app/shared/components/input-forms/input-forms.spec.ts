import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';

import { Messages } from '@shared/constants/messages';

import { InputFormsComponent } from './input-forms';

describe('InputFormsComponent', () => {
  let component: InputFormsComponent;
  let fixture: ComponentFixture<InputFormsComponent>;
  let control: FormControl;

  beforeEach(async () => {
    control = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    });

    await TestBed.configureTestingModule({
      imports: [InputFormsComponent]
    })
      .overrideComponent(InputFormsComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(InputFormsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
  });

  it('ShouldReturnFalse_WhenControlIsInvalidButUntouched', () => {
    expect(component.isInvalid).toBe(false);
  });

  it('ShouldReturnTrue_WhenControlIsInvalidAndTouched', () => {
    control.markAsTouched();

    expect(component.isInvalid).toBe(true);
  });

  it('ShouldReturnErrorMessage_WhenControlIsInvalidAndTouched', () => {
    control.markAsTouched();

    expect(component.errorMessage).toBe(Messages.RequiredField);
  });

  it('ShouldDetectTextarea_WhenTypeIsTextarea', () => {
    fixture.componentRef.setInput('type', 'textarea');

    expect(component.isTextarea()).toBe(true);
  });

  it('ShouldReturnFalseForTextarea_WhenTypeIsText', () => {
    fixture.componentRef.setInput('type', 'text');

    expect(component.isTextarea()).toBe(false);
  });
});
