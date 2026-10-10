
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportChartComponent } from './report-chart.component';

describe('ReportChartComponent', () => {
  let component: ReportChartComponent;
  let fixture: ComponentFixture<ReportChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportChartComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('ariaLabel', 'Distribuição de tarefas');
    fixture.componentRef.setInput('items', []);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an accessible SVG chart', () => {
    const svg = fixture.nativeElement.querySelector('svg');

    expect(svg).toBeTruthy();
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe(
      'Distribuição de tarefas'
    );
  });

  it('should render the donut chart container', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.donut-chart')).toBeTruthy();
    expect(element.querySelector('.donut-center')).toBeTruthy();
  });

  it('should display the task count label', () => {
    const element = fixture.nativeElement as HTMLElement;
    const center = element.querySelector('.donut-center');

    expect(center?.textContent).toContain('tarefas');
  });
});
