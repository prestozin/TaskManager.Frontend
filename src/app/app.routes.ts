import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';
import { Login } from '@features/auth/pages/login/login';
import { Register } from '@features/auth/pages/register/register';
import { FrontPage } from '@features/front-page/front-page';
import { Profile } from '@features/profile/pages/profile/profile';
import { Report } from '@features/report/pages/report/report';
import { Settings } from '@features/settings/pages/settings/settings';
import { Tasks } from '@features/tasks/pages/tasks/tasks';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: FrontPage
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'report',
        component: Report,
        canActivate: [authGuard]
    },
    {
        path: 'tasks',
        component: Tasks,
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        component: Profile,
        canActivate: [authGuard]
    },
    {
        path: 'settings',
        component: Settings,
        canActivate: [authGuard]
    }
];