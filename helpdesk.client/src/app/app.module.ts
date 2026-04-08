import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'

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

@NgModule({
  declarations: [
    AppComponent,
    TicketListComponent,
    TicketCreateComponent,
    TicketDetailComponent,
    TicketEditComponent,
    DashboardHomeComponent,
    MainLayoutComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule, FormsModule
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor ]))],
  bootstrap: [AppComponent]
})
export class AppModule { }
