import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service'
import { DashboardSummary } from '../../models/dashboard-summary.model'
@Component({
  selector: 'app-dashboard-home',
  standalone: false,
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent implements OnInit {
  summary?: DashboardSummary;
  loading = false;
  errorMessage = '';

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;
    this.errorMessage = '';
    this.dashboardService.getSummary().subscribe({
      next: (response) => {
        this.summary = response
        this.loading = false
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = 'gagal mengambil data summary';
        this.loading=false
      }
    })
  }
}
