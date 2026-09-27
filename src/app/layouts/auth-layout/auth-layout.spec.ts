import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLayoutComponent } from './auth-layout';

describe('AuthLayoutComponent', () => {
  let component: AuthLayoutComponent;
  let fixture: ComponentFixture<AuthLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLayoutComponent]
    })
      .overrideComponent(AuthLayoutComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(AuthLayoutComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Login');
    fixture.componentRef.setInput('primaryButtonText', 'Entrar');
    fixture.detectChanges();
  });

  it('ShouldEmitSubmit_WhenNotLoading', () => {
    const emitted = vi.fn();
    component.submitClicked.subscribe(emitted);

    component.submit();

    expect(emitted).toHaveBeenCalled();
  });

  it('ShouldNotEmitSubmit_WhenLoading', () => {
    fixture.componentRef.setInput('isLoading', true);
    const emitted = vi.fn();
    component.submitClicked.subscribe(emitted);

    component.submit();

    expect(emitted).not.toHaveBeenCalled();
  });
});
