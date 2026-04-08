import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { LoginRequest } from '../../feautures/auth/models/login-request'
import { LoginResponse } from '../../feautures/auth/models/login-response'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "/auth"
  private tokenKey = "helpdesk_token"
  private userKey ="helpdesk_user"

  constructor(private http: HttpClient) { }
  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token),
          localStorage.setItem(this.userKey, JSON.stringify(response))
      })
    )
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }
  getCurrentUser(): LoginResponse | null {
    const raw = localStorage.getItem(this.userKey)
    return raw ? JSON.parse(raw) : null
  }
  isLoggedIn(): boolean {
    return !this.getToken()
  }
  logout(): void {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
  }
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roleName === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return !!user && roles.includes(user.roleName);
  }
  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isAgent(): boolean {
    return this.hasRole('Agent');
  }

  isEmployee(): boolean {
    return this.hasRole('Employee');
  }
}
