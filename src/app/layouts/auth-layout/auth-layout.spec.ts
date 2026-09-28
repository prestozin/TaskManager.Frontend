import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLayoutComponent } from './auth-layout';

describe('AuthLayoutComponent', () => {
  let component: AuthLayoutComponent;
  let fixture: ComponentFixture<AuthLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLayoutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLayoutComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Login');
    fixture.componentRef.setInput('primaryButtonText', 'Entrar');
    fixture.detectChanges();
  });

  it('ShouldExposeInputs_WhenValuesAreProvided', () => {
    expect(component.title()).toBe('Login');
    expect(component.primaryButtonText()).toBe('Entrar');
  });

  it('ShouldEmitSubmit_WhenPrimaryButtonIsClicked', () => {
    const emitted = vi.fn();
    component.submitClicked.subscribe(emitted);

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-submit');
    button.click();

    expect(emitted).toHaveBeenCalled();
  });
});
