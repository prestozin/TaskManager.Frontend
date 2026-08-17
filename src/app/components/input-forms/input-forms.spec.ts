import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryInputComponent } from './input-forms';

describe('PrimaryInput', () => {
  let component: PrimaryInputComponent;
  let fixture: ComponentFixture<PrimaryInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimaryInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrimaryInputComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
