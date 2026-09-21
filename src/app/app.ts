import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    private readonly overlayContainer = inject(OverlayContainer);

    constructor() {
        this.overlayContainer
            .getContainerElement()
            .classList.add('zorro-scope');
    }

}