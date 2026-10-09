import { Component, computed, input, signal } from '@angular/core';
import { ChartItem, DonutChartSegment } from '@features/report/models/report.models';

@Component({
  selector: 'app-report-chart',
  imports: [],
  templateUrl: './report-chart.component.html',
  styleUrl: './report-chart.component.scss',
})

export class ReportChartComponent {

  readonly items = input.required<ChartItem[]>();
  readonly ariaLabel = input.required<string>();

  readonly activeSegment = signal<DonutChartSegment | null>(null);

  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.count, 0)
  );

  readonly segments = computed(() => this.createSegments(this.items()));

  private createSegments(items: ChartItem[]): DonutChartSegment[] {
    const total = items.reduce((sum, item) => sum + item.count, 0);
    if (!total) return [];

    const circumference = 2 * Math.PI * 65;
    let offset = 0;

    return items
      .filter(item => item.count > 0)
      .map(item => {
        const length = (item.count / total) * circumference;

        const segment: DonutChartSegment = {
          ...item,
          percentage: Number(((item.count / total) * 100).toFixed(1)),
          dashArray: `${length + 1} ${circumference}`,
          dashOffset: -offset
        };

        offset += length;
        return segment;
      });
  }
}
