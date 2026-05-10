import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AddPasswordComponent } from './pages/add-password/add-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditPasswordComponent } from './pages/edit-password/edit-password.component';
import { LoginComponent } from './pages/login/login.component';
import { PasswordListComponent } from './pages/password-list/password-list.component';
import { RegisterComponent } from './pages/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    AddPasswordComponent,
    DashboardComponent,
    EditPasswordComponent,
    LoginComponent,
    PasswordListComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
