import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Department } from '../../feautures/departments/models/department.model'
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = '/api/Departements';
  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }
}
