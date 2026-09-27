import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App]
    })
      .overrideComponent(App, { set: { template: '' } })
      .compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    fixture = TestBed.createComponent(App);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('ShouldCreateApp_WhenComponentIsInstantiated', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('ShouldAddZorroScope_WhenAppIsCreated', () => {
    expect(overlayContainer.getContainerElement().classList.contains('zorro-scope')).toBe(true);
  });
});
