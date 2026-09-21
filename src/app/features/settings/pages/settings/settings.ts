import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';



@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        MainLayoutComponent,
        RouterLink,
        FormsModule,
        NzIconModule,
        NzSelectModule,
        NzSwitchModule
    ],
    templateUrl: './settings.html',
    styleUrl: './settings.scss'
})
export class Settings {

    confirmTaskDelete = true;
    taskPageSize = 10;

}