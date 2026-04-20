import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Role } from '../../feautures/roles/models/role.model'
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = '/api/Roles'
  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }
}
