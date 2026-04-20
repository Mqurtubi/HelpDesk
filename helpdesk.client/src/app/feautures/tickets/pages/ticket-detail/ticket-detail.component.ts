import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket.model'
import { TicketComment } from '../../models/ticket-comment.model'
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { TicketCommentService } from '../../../../core/services/ticket-comment.service'
import { UserService } from '../../../../core/services/user.service'
import { AuthService } from '../../../../core/services/auth.service'
import { User } from '../../../users/models/user.model';
@Component({
  selector: 'app-ticket-detail',
  standalone: false,
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {
  ticketId = 0;
  ticket?: Ticket;
  comments: TicketComment[] = []
  users: User[] = []

  loadingTicket = false
  loadingComments = false
  loadingUsers = false
  deleteLoading = false
  errorMessage = ''

  commentMessage = ''
  selectedStatus = ''
  commentUserId = 0

  constructor(private route: ActivatedRoute,
    private router : Router,
    private ticketService: TicketService,
    private ticketCommentService: TicketCommentService,
    private userService: UserService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTicket();
    this.loadComments();
    console.log(this.permission())
    console.log(this.permission())
    console.log(this.ticket)
  }


  loadTicket():void {
    this.loadingTicket = true
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (response) => {
        this.ticket = response
        this.selectedStatus = this.ticket.status
          this.loadingTicket = false
      },
      error: (error) => {
        console.log(error)
        this.errorMessage = 'gagal mengambil detail ticket'
        this.loadingComments=false
      }
    })
  }
  loadComments(): void {
    this.loadingComments = true
    this.ticketCommentService.getCommentByTicketId(this.ticketId).subscribe({
      next: (response) => {
        this.comments = response
          this.loadingComments= false
      },
      error: (error) => {
        console.log(error)
        this.errorMessage = error
        this.loadingComments = false
      }
    })
  }
  submitComment(): void {
    if (!this.commentUserId) {
      this.errorMessage = "pilih user terlebih dahulu"
      return
    }
    if (!this.commentMessage.trim()) {
      this.errorMessage ="pesan wajib diisi"
      return
    }
    this.ticketCommentService.createComment({
      ticketId: this.ticketId,
      userId: this.commentUserId,
      message: this.commentMessage
    }).subscribe({
      next: () => {
        this.commentMessage = '',
          this.loadComments();
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  updateStatus(): void{
    this.ticketService.updateTicketStatus(this.ticketId, { status: this.selectedStatus }).subscribe({
      next: () => {
        this.loadTicket()
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  deleteTicket(): void {
    if (!this.ticket) {
      return;
    }
    const confirmed = window.confirm(`hapus ticket ${this.ticket.title}? `)
    if (!confirmed) {
      return;
    }
    this.deleteLoading = true
    this.errorMessage = ''
    this.ticketService.deleteTicket(this.ticket.id).subscribe({
      next: (response) => {
        this.deleteLoading = false;
        this.router.navigate(["/tickets"])
      },
      error: (error) => {
        this.deleteLoading = false;
        this.errorMessage = error?.error?.message??"gagal delete ticket"
      }
    })
  }
  permission(): boolean {
    return this.authService.getCurrentUserId() == this.ticket?.createdByUserId
  }
  canDelete(): boolean {
    if (!this.ticket) {
      return false
    }
    return this.authService.isAdmin() ||
      (
        this.authService.isEmployee() &&
        this.authService.getCurrentUserId() == this.ticket.createdByUserId &&
        this.ticket.status === 'Open'
      );
  }
}
