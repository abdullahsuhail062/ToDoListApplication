import { Routes } from '@angular/router';
import { RegisterationComponent } from './registeration/registeration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { authGuard, loginGuard } from './authFiles/auth.guard';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { SettingsComponent } from './settings/settings.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
     { path: 'registeration',component: RegisterationComponent},
     { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
     { path: 'login', component: LoginComponent, canActivate: [loginGuard]},
     { path: 'user-profile', component: UserProfileComponent, canActivate: [authGuard]},
     { path: 'to-do-list', component: ToDoListComponent, canActivate: [authGuard]},
     { path: 'settings', component: SettingsComponent, canActivate: [authGuard]}
];
