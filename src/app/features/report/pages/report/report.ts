import { Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { EReportPeriod } from '@features/report/enums/report.enum';
import {
  ReportItemResponse,
  ReportPeriodOption
} from '@features/report/models/report.models';
import { TaskComponent } from '@features/tasks/components/task/task.component';
import {
  ETaskPriority,
  ETaskStatus
} from '@features/tasks/enums/task.enum';
import { TaskFacade } from '@features/tasks/facades/task.facade';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout';
import {
  formatDateToApi,
  parseApiDate
} from '@shared/utils/date.util';

@Component({
  selector: 'app-report',
  imports: [
    MainLayoutComponent,
    TaskComponent,
    FormsModule,
    NzDatePickerModule,
    NzSelectModule
  ],
  templateUrl: './report.html',
  styleUrl: './report.scss'
})
export class Report implements OnInit {

  private readonly taskFacade = inject(TaskFacade);

  readonly report = this.taskFacade.report;

  readonly selectedPeriod = this.taskFacade.selectedReportPeriod;
  readonly selectedStartDate = this.taskFacade.selectedReportStartDate;
  readonly selectedEndDate = this.taskFacade.selectedReportEndDate;

  readonly periodOptions: ReportPeriodOption[] = [
    {
      value: EReportPeriod.SevenDays,
      label: 'Últimos 7 dias'
    },
    {
      value: EReportPeriod.ThirtyDays,
      label: 'Últimos 30 dias'
    },
    {
      value: EReportPeriod.NinetyDays,
      label: 'Últimos 90 dias'
    }
  ];

  readonly startDate = computed(() =>
    parseApiDate(this.selectedStartDate())
  );

  readonly endDate = computed(() =>
    parseApiDate(this.selectedEndDate())
  );

  readonly totalTasks = computed(() =>
    this.report()?.totalTasks ?? 0
  );

  readonly reportTasks = computed(() =>
    this.report()?.tasks ?? []
  );

  readonly pendingCount = computed(() =>
    this.getStatus(ETaskStatus.Pending)?.count ?? 0
  );

  readonly pendingPercentage = computed(() =>
    this.getStatus(ETaskStatus.Pending)?.percentage ?? 0
  );

  readonly progressCount = computed(() =>
    this.getStatus(ETaskStatus.InProgress)?.count ?? 0
  );

  readonly progressPercentage = computed(() =>
    this.getStatus(ETaskStatus.InProgress)?.percentage ?? 0
  );

  readonly completedCount = computed(() =>
    this.getStatus(ETaskStatus.Completed)?.count ?? 0
  );

  readonly completedPercentage = computed(() =>
    this.getStatus(ETaskStatus.Completed)?.percentage ?? 0
  );

  readonly canceledCount = computed(() =>
    this.getStatus(ETaskStatus.Canceled)?.count ?? 0
  );

  readonly canceledPercentage = computed(() =>
    this.getStatus(ETaskStatus.Canceled)?.percentage ?? 0
  );

  readonly lowPriorityCount = computed(() =>
    this.getPriority(ETaskPriority.Low)?.count ?? 0
  );

  readonly lowPriorityPercentage = computed(() =>
    this.getPriority(ETaskPriority.Low)?.percentage ?? 0
  );

  readonly mediumPriorityCount = computed(() =>
    this.getPriority(ETaskPriority.Medium)?.count ?? 0
  );

  readonly mediumPriorityPercentage = computed(() =>
    this.getPriority(ETaskPriority.Medium)?.percentage ?? 0
  );

  readonly highPriorityCount = computed(() =>
    this.getPriority(ETaskPriority.High)?.count ?? 0
  );

  readonly highPriorityPercentage = computed(() =>
    this.getPriority(ETaskPriority.High)?.percentage ?? 0
  );

  isPeriodOpen = false;

  ngOnInit(): void {
    this.taskFacade.initializeReport();
  }

  selectPeriod(period: EReportPeriod): void {
    this.taskFacade.selectReportPeriod(period);
  }

  selectStartDate(date: Date | null): void {
    this.taskFacade.selectReportStartDate(formatDateToApi(date));
  }

  selectEndDate(date: Date | null): void {
    this.taskFacade.selectReportEndDate(formatDateToApi(date));
  }

  clearFilters(): void {
    this.taskFacade.clearReportFilters();
  }

  setPeriodOpen(isOpen: boolean): void {
    this.isPeriodOpen = isOpen;
  }

  closeOverlays(): void {
    this.isPeriodOpen = false;
  }

  private getStatus(statusId: ETaskStatus): ReportItemResponse | undefined {
    return this.report()?.status.find(status => status.id === statusId);
  }

  private getPriority(priorityId: ETaskPriority): ReportItemResponse | undefined {
    return this.report()?.priority.find(priority => priority.id === priorityId);
  }
}
