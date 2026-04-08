import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { TicketService } from '../../../../core/services/ticket.service'
import { UserService } from '../../../../core/services/user.service'
import { User } from '../../../users/models/user.model';
@Component({
  selector: 'app-ticket-create',
  standalone: false,
  templateUrl: './ticket-create.component.html',
  styleUrl: './ticket-create.component.css'
})
export class TicketCreateComponent implements OnInit {
  formData = {
    title: '',
    description: '',
    priority: 'Medium',
    createdByUserId:1
  }
  users: User[]=[]
  loading = false;
  errorMessage = '';
  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  submitForm(): void {
    this.errorMessage = ''
    if (!this.formData.title.trim()) {
      this.errorMessage = "Title wajib diisi"
      return
    }
    if (!this.formData.description.trim()) {
      this.errorMessage = "Description wajib diisi"
      return
    }
    this.loading = true;
    this.ticketService.createTicket(this.formData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tickets']);
      },
      error: (error) => {
        console.log(error)
        this.errorMessage = "gagal membuat ticket"
        this.loading = false
      }
    })
  }
}
