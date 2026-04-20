import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, tap, catchError, BehaviorSubject } from 'rxjs'
import { LoginRequest } from '../../feautures/auth/models/login-request'
import { LoginResponse } from '../../feautures/auth/models/login-response'
import { User } from '../../feautures/users/models/user.model';
export interface CurrentUser{
  id: number;
  fullName: string;
  email: string;
  departmentId?: number;
  departmentName?: string;
  roleId?: number;
  roleName: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "/api/Auth"
  private tokenKey = "helpdesk_token"
  private userKey ="helpdesk_user"

  constructor(private http: HttpClient) { }
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token),
          this.currentUserSubject.next({
            id: response.id,
            fullName: response.fullName,
            email: response.email,
            roleName: response.roleName,
            departmentName: response.departmentName
          })
      }),
      catchError((error) => {
        console.log(error)
        throw error
      })
    )
  }

  me(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      })
    )
  }
  refreshCurrentUser(): void {
    if (!this.isLoggedIn()) {
      return
    }
    this.me().subscribe({
      error: () => {
        this.logout();
      }
    })
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }
  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }
  getCurrentUserId(): number | null {
    return this.currentUserSubject.value?.id ?? null;
  }
  isLoggedIn(): boolean {
    return !!this.getToken()
  }
  logout(): void {
    localStorage.removeItem(this.tokenKey)
    this.currentUserSubject.next(null)
  }
  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.roleName == role;
  }

  hasAnyRole(roles: string[]): boolean {
    const roleName = this.currentUserSubject.value?.roleName;
    return !!roleName && roles.includes(roleName);
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
