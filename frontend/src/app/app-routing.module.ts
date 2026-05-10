import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AddPasswordComponent } from './pages/add-password/add-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditPasswordComponent } from './pages/edit-password/edit-password.component';
import { LoginComponent } from './pages/login/login.component';
import { PasswordListComponent } from './pages/password-list/password-list.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'passwords', pathMatch: 'full' },
      { path: 'passwords', component: PasswordListComponent },
      { path: 'passwords/add', component: AddPasswordComponent },
      { path: 'passwords/edit/:id', component: EditPasswordComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
