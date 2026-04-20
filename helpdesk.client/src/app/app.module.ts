import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TicketListComponent } from './feautures/tickets/pages/ticket-list/ticket-list.component';
import { TicketCreateComponent } from './feautures/tickets/pages/ticket-create/ticket-create.component';
import { TicketDetailComponent } from './feautures/tickets/pages/ticket-detail/ticket-detail.component';
import { TicketEditComponent } from './feautures/tickets/pages/ticket-edit/ticket-edit.component';
import { DashboardHomeComponent } from './feautures/dashboard/pages/dashboard-home/dashboard-home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './feautures/auth/pages/login/login.component';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { UserListComponent } from './feautures/users/pages/user-list/user-list.component';
import { UserCreateComponent } from './feautures/users/pages/user-create/user-create.component';
import { UserDetailComponent } from './feautures/users/pages/user-detail/user-detail.component';
import { UserEditComponent } from './feautures/users/pages/user-edit/user-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    TicketListComponent,
    TicketCreateComponent,
    TicketDetailComponent,
    TicketEditComponent,
    DashboardHomeComponent,
    MainLayoutComponent,
    LoginComponent,
    UserListComponent,
    UserListComponent,
    UserCreateComponent,
    UserDetailComponent,
    UserEditComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule, FormsModule,
    ReactiveFormsModule
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor ]))],
  bootstrap: [AppComponent]
})
export class AppModule { }
