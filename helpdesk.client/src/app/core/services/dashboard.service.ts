import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { DashboardSummary } from '../../feautures/dashboard/models/dashboard-summary.model'
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl='/dashboard'
  constructor(private http: HttpClient) { }
  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`)
  }
}
