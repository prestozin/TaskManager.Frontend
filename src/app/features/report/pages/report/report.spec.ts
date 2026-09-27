import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EReportPeriod } from '@features/report/enums/report.enum';
import { TaskFacade } from '@features/tasks/facades/task.facade';

import { Report } from './report';

describe('Report', () => {
  let component: Report;
  let fixture: ComponentFixture<Report>;
  let reportSignal: ReturnType<typeof signal<any>>;
  let taskFacade: {
    report: ReturnType<typeof signal<any>>;
    selectedReportPeriod: ReturnType<typeof signal<EReportPeriod>>;
    selectedReportStartDate: ReturnType<typeof signal<string | null>>;
    selectedReportEndDate: ReturnType<typeof signal<string | null>>;
    initializeReport: ReturnType<typeof vi.fn>;
    selectReportPeriod: ReturnType<typeof vi.fn>;
    selectReportStartDate: ReturnType<typeof vi.fn>;
    selectReportEndDate: ReturnType<typeof vi.fn>;
    clearReportFilters: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    reportSignal = signal({
      totalTasks: 4,
      status: [
        { id: 1, name: 'Pendente', count: 1, percentage: 25 },
        { id: 2, name: 'Em Progresso', count: 1, percentage: 25 },
        { id: 3, name: 'Concluída', count: 2, percentage: 50 }
      ],
      priority: [
        { id: 1, name: 'Baixa', count: 2, percentage: 50 },
        { id: 2, name: 'Média', count: 1, percentage: 25 },
        { id: 3, name: 'Alta', count: 1, percentage: 25 }
      ],
      tasks: []
    });

    taskFacade = {
      report: reportSignal,
      selectedReportPeriod: signal(EReportPeriod.ThirtyDays),
      selectedReportStartDate: signal<string | null>('2026-09-01'),
      selectedReportEndDate: signal<string | null>('2026-09-27'),
      initializeReport: vi.fn(),
      selectReportPeriod: vi.fn(),
      selectReportStartDate: vi.fn(),
      selectReportEndDate: vi.fn(),
      clearReportFilters: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Report],
      providers: [
        { provide: TaskFacade, useValue: taskFacade }
      ]
    })
      .overrideComponent(Report, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(Report);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ShouldInitializeReport_WhenComponentInitializes', () => {
    expect(taskFacade.initializeReport).toHaveBeenCalled();
  });

  it('ShouldCalculateReportValues_WhenReportIsAvailable', () => {
    expect(component.totalTasks()).toBe(4);
    expect(component.pendingCount()).toBe(1);
    expect(component.completedCount()).toBe(2);
    expect(component.completedPercentage()).toBe(50);
    expect(component.highPriorityCount()).toBe(1);
    expect(component.lowPriorityPercentage()).toBe(50);
  });

  it('ShouldReturnZero_WhenReportCategoryDoesNotExist', () => {
    reportSignal.set({
      totalTasks: 0,
      status: [],
      priority: [],
      tasks: []
    });

    expect(component.pendingCount()).toBe(0);
    expect(component.highPriorityPercentage()).toBe(0);
  });

  it('ShouldForwardPeriodAndDateFilters_WhenSelectionChanges', () => {
    component.selectPeriod(EReportPeriod.SevenDays);
    component.selectStartDate(new Date(2026, 8, 1));
    component.selectEndDate(new Date(2026, 8, 27));

    expect(taskFacade.selectReportPeriod).toHaveBeenCalledWith(EReportPeriod.SevenDays);
    expect(taskFacade.selectReportStartDate).toHaveBeenCalledWith('2026-09-01');
    expect(taskFacade.selectReportEndDate).toHaveBeenCalledWith('2026-09-27');
  });

  it('ShouldClearFilters_WhenClearFiltersIsCalled', () => {
    component.clearFilters();

    expect(taskFacade.clearReportFilters).toHaveBeenCalled();
  });

  it('ShouldClosePeriodDropdown_WhenCloseOverlaysIsCalled', () => {
    component.setPeriodOpen(true);
    expect(component.isPeriodOpen).toBe(true);

    component.closeOverlays();

    expect(component.isPeriodOpen).toBe(false);
  });
});
