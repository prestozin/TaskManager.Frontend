import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tasks } from './tasks';

describe('Tasks', () => {
  let fixture: ComponentFixture<Tasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tasks]
    })
      .overrideComponent(Tasks, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(Tasks);
  });

  it('ShouldCreatePage_WhenComponentIsInstantiated', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
