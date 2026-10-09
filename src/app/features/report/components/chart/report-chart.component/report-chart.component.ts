import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { LoadingService } from '@core/services/loading/loading.service';
import { ChartItem, DonutChartSegment } from '@features/report/models/report.models';

@Component({
  selector: 'app-report-chart',
  imports: [],
  templateUrl: './report-chart.component.html',
  styleUrl: './report-chart.component.scss',
})
export class ReportChartComponent {

  private readonly loadingService = inject(LoadingService);

  readonly items = input.required<ChartItem[]>();
  readonly ariaLabel = input.required<string>();
  readonly activeSegment = signal<DonutChartSegment | null>(null);
  readonly animationKey = signal(0);

  private wasLoading = false;

  readonly totalTasksCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.count, 0)
  );

  readonly segments = computed(() => this.createSegments(this.items()));

  readonly animatedSegments = computed(() =>
    this.segments().map(segment => ({
      ...segment,
      trackId: `${this.animationKey()}-${segment.className}`
    }))
  );

  constructor() {
    effect(() => {
      const isLoading = this.loadingService.isLoading();

      if (this.wasLoading && !isLoading) {
        this.animationKey.update(key => key + 1);
      }

      this.wasLoading = isLoading;
    });
  }

  private createSegments(items: ChartItem[]): DonutChartSegment[] {
    const total = items.reduce((sum, item) => sum + item.count, 0);
    if (!total) return [];

    const circumference = 2 * Math.PI * 65;
    let offset = 0;

    return items.filter(item => item.count > 0).map(item => {
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