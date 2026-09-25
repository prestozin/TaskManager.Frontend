import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskComponent } from '@features/tasks/components/task/task.component';

import { TaskFacade } from '@features/tasks/facades/task.facade';

import { MainLayoutComponent } from '@layouts/main-layout/main-layout';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';


@Component({
  selector: 'app-dashboard',
  imports: [
    MainLayoutComponent,
    TaskComponent,
    FormsModule,
    DatePipe,
    NzButtonModule,
    NzDatePickerModule,
    NzSelectModule
  ],
  templateUrl: './report.html',
  styleUrl: './report.scss',
})
export class Report implements OnInit {

  private readonly taskFacade = inject(TaskFacade);

  readonly report = this.taskFacade.report;

  readonly selectedStartDate = this.taskFacade.reportStartDate;
  readonly selectedEndDate = this.taskFacade.reportEndDate;

  readonly period = signal<string>('30');

  readonly startDate = computed(() =>
    this.parseDate(this.selectedStartDate())
  );

  readonly endDate = computed(() =>
    this.parseDate(this.selectedEndDate())
  );


  readonly totalTasks = computed(() =>
    this.report()?.totalTasks ?? 0
  );


  readonly pendingCount = computed(() =>
    this.getStatus(1)?.count ?? 0
  );

  readonly pendingPercentage = computed(() =>
    this.getStatus(1)?.percentage ?? 0
  );

  readonly progressCount = computed(() =>
    this.getStatus(2)?.count ?? 0
  );

  readonly progressPercentage = computed(() =>
    this.getStatus(2)?.percentage ?? 0
  );

  readonly completedCount = computed(() =>
    this.getStatus(3)?.count ?? 0
  );

  readonly completedPercentage = computed(() =>
    this.getStatus(3)?.percentage ?? 0
  );

  readonly canceledCount = computed(() =>
    this.getStatus(4)?.count ?? 0
  );

  readonly canceledPercentage = computed(() =>
    this.getStatus(4)?.percentage ?? 0
  );

  readonly pendingCanceledCount = computed(() =>
    this.pendingCount() + this.canceledCount()
  );

  readonly pendingCanceledPercentage = computed(() =>
    this.pendingPercentage() + this.canceledPercentage()
  );


  readonly lowPriorityCount = computed(() =>
    this.getPriority(1)?.count ?? 0
  );

  readonly lowPriorityPercentage = computed(() =>
    this.getPriority(1)?.percentage ?? 0
  );

  readonly mediumPriorityCount = computed(() =>
    this.getPriority(2)?.count ?? 0
  );

  readonly mediumPriorityPercentage = computed(() =>
    this.getPriority(2)?.percentage ?? 0
  );

  readonly highPriorityCount = computed(() =>
    this.getPriority(3)?.count ?? 0
  );

  readonly highPriorityPercentage = computed(() =>
    this.getPriority(3)?.percentage ?? 0
  );


  isPeriodOpen = false;


  ngOnInit(): void {
    this.applyPeriod();
    this.taskFacade.getReport();
  }


  selectPeriod(period: string): void {
    this.period.set(period);
    this.applyPeriod();
    this.taskFacade.getReport();
  }

  selectStartDate(date: Date | null): void {
    this.taskFacade.selectReportStartDate(this.formatDate(date));

    this.taskFacade.getReport();
  }

  selectEndDate(date: Date | null): void {
    this.taskFacade.selectReportEndDate(this.formatDate(date));

    this.taskFacade.getReport();
  }


  applyPeriod(): void {
    const endDate = new Date();
    const startDate = new Date();

    startDate.setDate(endDate.getDate() - Number(this.period()));

    this.taskFacade.selectReportStartDate(this.formatDate(startDate));

    this.taskFacade.selectReportEndDate(this.formatDate(endDate));
  }

  clearFilters(): void {
    this.period.set('30');
    this.applyPeriod();
    this.taskFacade.getReport();
  }


  closeOverlays(): void {
    this.isPeriodOpen = false;
  }


  private getStatus(id: number) {
    return this.report()?.status.find(status => status.id === id);
  }

  private getPriority(id: number) {
    return this.report()?.priority.find(priority =>priority.id === id);
  }

  private formatDate(date: Date | null): string | null {
    if (!date) 
      return null;
    

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private parseDate(date: string | null): Date | null {
    if (!date) 
      return null;
    

    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day);
  }

}