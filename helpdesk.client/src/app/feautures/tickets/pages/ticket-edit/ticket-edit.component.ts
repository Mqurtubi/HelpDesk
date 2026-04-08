import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { TicketService } from '../../../../core/services/ticket.service'
@Component({
  selector: 'app-ticket-edit',
  standalone: false,
  templateUrl: './ticket-edit.component.html',
  styleUrl: './ticket-edit.component.css'
})
export class TicketEditComponent implements OnInit {
  ticketId = 0
  formData = {
    title: '',
    description: '',
    priority:'Medium'
  }
  loading = false
  loadingTicket = false
  errorMessage=''

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit():void {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'))
    this.loadTicket()
  }

  loadTicket(): void {
    this.loadingTicket = true
    this.errorMessage = ''

    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (response) => {
        this.formData.title = response.title
        this.formData.description = response.description
        this.formData.priority = response.priority
        this.loadingTicket = false
      },
      error: (error) => {
        console.log(error)
        this.errorMessage = 'gagal mengambil data ticket'
        this.loadingTicket=false
      }
    })
  }
  submitForm(): void {
    this.errorMessage = ''
    if (!this.formData.title.trim()) {
      this.errorMessage = 'Title wajib diisi.';
      return;
    }

    if (!this.formData.description.trim()) {
      this.errorMessage = 'Description wajib diisi.';
      return;
    }
    this.loading = true
    this.ticketService.updateTicket(this.ticketId, this.formData).subscribe({
      next: (response) => {
        this.loading = false
        this.router.navigate(['/tickets', this.ticketId])
      },
      error: (error) => {
        console.log(error)
        this.errorMessage = 'gagal edit ticket'
        this.loading=false
      }
    })
  }
}
