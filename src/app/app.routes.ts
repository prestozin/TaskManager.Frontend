import { Routes } from '@angular/router';
import { Login as LoginComponent } from './pages/login/login';
import { Register as RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { Profile as ProfileComponent } from './pages/profile/profile';
import { Tasks as TasksComponent } from './pages/tasks/tasks';
import { Settings as SettingsComponent } from './pages/settings/settings';

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
        component: DashboardComponent
    },
    {
        path: 'tasks',
        component: TasksComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
     {
        path: 'settings',
        component: SettingsComponent
    },
];
