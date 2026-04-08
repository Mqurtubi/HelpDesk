import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  sidebarOpen = false;
  constructor(public authService: AuthService, private router: Router) { }
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen
  }
  closeSidebar(): void {
    this.sidebarOpen=false
  }
  logout(): void {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
