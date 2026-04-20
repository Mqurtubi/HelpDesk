import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { User } from '../../feautures/users/models/user.model'

interface CreateUserRequest {
  fullName: string,
  email: string,
  password: string,
  departementId: number,
  roleId: number
}
interface UpdateUserRequest {
  fullName: string,
  email: string,
  password: string,
  departementId: number,
  roleId: number
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/Users'
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl)
  }
  createUsers(payload: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, payload);
  }
  getUserByID(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
  }
  updateUser(id: number, payload: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, payload)
  }
  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${id}`)
  }
}
