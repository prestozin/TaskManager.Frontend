import { Injectable, signal } from '@angular/core';

import { TaskReportParams, TaskReportResponse } from '@features/tasks/models/task.models';


@Injectable({
    providedIn: 'root'
})

export class ReportState {

    readonly report = signal<TaskReportResponse | null>(null);

    readonly selectedStartDate = signal<string | null>(null);
    readonly selectedEndDate = signal<string | null>(null);

    readonly reportParams = new TaskReportParams();


    setReport(report: TaskReportResponse): void {
        this.report.set(report);
    }

    clearReport(): void {
        this.report.set(null);
    }


    setStartDate(date: string | null): void {
        this.selectedStartDate.set(date);

        this.reportParams.startDate = date;
        this.reportParams.pageNumber = 1;
    }

    setEndDate(date: string | null): void {
        this.selectedEndDate.set(date);

        this.reportParams.endDate = date;
        this.reportParams.pageNumber = 1;
    }


    clearFilters(): void {
        this.selectedStartDate.set(null);
        this.selectedEndDate.set(null);

        this.reportParams.startDate = null;
        this.reportParams.endDate = null;
        this.reportParams.pageNumber = 1;
    }

}