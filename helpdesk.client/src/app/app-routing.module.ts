import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketListComponent } from './feautures/tickets/pages/ticket-list/ticket-list.component'
import { TicketCreateComponent } from './feautures/tickets/pages/ticket-create/ticket-create.component'
import { TicketDetailComponent } from './feautures/tickets/pages/ticket-detail/ticket-detail.component';
import { TicketEditComponent } from './feautures/tickets/pages/ticket-edit/ticket-edit.component'
import { DashboardHomeComponent } from './feautures/dashboard/pages/dashboard-home/dashboard-home.component'
import { MainLayoutComponent } from './layout/main-layout/main-layout.component'
import { LoginComponent } from './feautures/auth/pages/login/login.component'
import { authGuard } from './core/guards/auth.guard';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'tickets', component: TicketListComponent },
      { path: 'tickets/create', component: TicketCreateComponent },
      { path: 'tickets/:id', component: TicketDetailComponent },
      { path: 'tickets/:id/edit', component: TicketEditComponent }
    ]
  },
  { path: "**", redirectTo:'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
