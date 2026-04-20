import { Component, OnInit } from '@angular/core';
import { AuthService, CurrentUser } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  sidebarOpen = false;
  currentUser$!: Observable<CurrentUser | null>
  constructor(public authService: AuthService, private router: Router) {
    
  }
  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
  }
  
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
