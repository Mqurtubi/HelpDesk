import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketListComponent } from './feautures/tickets/pages/ticket-list/ticket-list.component'
import { TicketCreateComponent } from './feautures/tickets/pages/ticket-create/ticket-create.component'
import { TicketDetailComponent } from './feautures/tickets/pages/ticket-detail/ticket-detail.component';
import { TicketEditComponent } from './feautures/tickets/pages/ticket-edit/ticket-edit.component'
import { UserListComponent } from './feautures/users/pages/user-list/user-list.component'
import { UserCreateComponent } from './feautures/users/pages/user-create/user-create.component'
import { UserDetailComponent } from './feautures/users/pages/user-detail/user-detail.component'
import { UserEditComponent } from './feautures/users/pages/user-edit/user-edit.component'
import { DashboardHomeComponent } from './feautures/dashboard/pages/dashboard-home/dashboard-home.component'
import { MainLayoutComponent } from './layout/main-layout/main-layout.component'
import { LoginComponent } from './feautures/auth/pages/login/login.component'
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard'
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'tickets', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardHomeComponent, canActivate: [roleGuard], data: { roles: ['Admin', 'Agent'] } },
      { path: 'tickets', component: TicketListComponent, canActivate: [roleGuard], data: { roles: ['Admin', 'Agent', 'Employee'] } },
      { path: 'tickets/create', component: TicketCreateComponent, canActivate: [roleGuard], data: { roles: ['Admin', 'Employee'] } },
      { path: 'tickets/:id', component: TicketDetailComponent, canActivate: [roleGuard], data: { roles: ['Admin', 'Agent', 'Employee'] } },
      { path: 'tickets/:id/edit', component: TicketEditComponent, canActivate: [roleGuard], data: { roles: ['Employee'] } },
      { path: 'users', component: UserListComponent, canActivate: [roleGuard], data: { roles: ['Admin'] } },
      { path: 'users/create', component: UserCreateComponent, canActivate: [roleGuard], data: { roles: ['Admin'] } },
      { path: 'users/:id', component: UserDetailComponent, canActivate: [roleGuard], data: { roles: ['Admin'] } },
      { path: 'users/:id/edit', component: UserEditComponent, canActivate: [roleGuard], data: { roles: ['Admin'] } },
    ]
  },
  { path: "**", redirectTo:'tickets' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
