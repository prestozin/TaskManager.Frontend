import { Routes } from '@angular/router';
import { Login as LoginComponent } from './pages/login/login';
import { Register as RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { Profile as ProfileComponent } from './pages/profile/profile';
import { Tasks as TasksComponent } from './pages/tasks/tasks';
import { Settings as SettingsComponent } from './pages/settings/settings';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'tasks',
        component: TasksComponent,
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },
     {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard]
    },
];
