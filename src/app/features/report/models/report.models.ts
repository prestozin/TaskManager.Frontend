import { EReportPeriod } from '@features/report/enums/report.enum';
import { TaskResponse } from '@features/tasks/models/task.models';

export class ReportParams {
    startDate: string | null = null;
    endDate: string | null = null;
    pageNumber = 1;
    pageSize = 4;
}

export interface ReportItemResponse {
    id: number;
    name: string;
    count: number;
    percentage: number;
}

export interface ReportResponse {
    totalTasks: number;
    status: ReportItemResponse[];
    priority: ReportItemResponse[];
    tasks: TaskResponse[];
}

export interface ReportPeriodOption {
    value: EReportPeriod;
    label: string;
}

export interface ChartItem {
    label: string;
    count: number;
    className: string;
}

export interface DonutChartSegment extends ChartItem {
    percentage: number;
    dashArray: string;
    dashOffset: number;
}
