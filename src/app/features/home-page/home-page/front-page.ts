import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
    selector: 'app-front-page',
    standalone: true,
    imports: [
        RouterLink,
        NzIconModule
    ],
    templateUrl: './front-page.html',
    styleUrl: './front-page.scss'
})
export class FrontPage {

}