import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { LoadingService } from '@core/services/loading/loading.service';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        NzSpinModule
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    private readonly overlayContainer = inject(OverlayContainer);
    private readonly loadingService = inject(LoadingService);

    readonly isLoading = this.loadingService.isLoading;

    constructor() {
        this.overlayContainer.getContainerElement().classList.add('zorro-scope');
    }
}