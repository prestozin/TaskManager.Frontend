import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth.guard";
import { Login } from "@features/auth/pages/login/login";
import { Register } from "@features/auth/pages/register/register";
import { Tasks } from "@features/tasks/pages/tasks/tasks";
import { Profile } from "@features/profile/pages/profile/profile";
import { Settings } from "@features/settings/pages/settings/settings";
import { Report } from "@features/report/pages/report/report";


export const routes: Routes = [
    {
        path: "login",
        component: Login,
    },
    {
        path: 'register',
        component: Register,
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
    },
];
