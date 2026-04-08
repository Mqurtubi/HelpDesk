import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket.model'
import { TicketComment } from '../../models/ticket-comment.model'
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { TicketCommentService } from '../../../../core/services/ticket-comment.service'
import { UserService } from '../../../../core/services/user.service'
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
  errorMessage = ''

  commentMessage = ''
  selectedStatus = 'Open'
  commentUserId = 0

  constructor(private route: ActivatedRoute,
    private ticketService: TicketService,
    private ticketCommentService: TicketCommentService,
    private userService: UserService) { }

  ngOnInit() {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUsers();
    this.loadTicket();
    this.loadComments();
  }


  loadTicket():void {
    this.loadingTicket = true
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (response) => {
        this.ticket = response
          this.selectedStatus = this.selectedStatus
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
  loadUsers(): void {
    this.loadingUsers = true
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response
        this.loadingUsers = false
        if (this.users.length > 0) {
          this.commentUserId = this.users[0].id
        }
      },
      error: (error) => {
        console.log(error)
        this.errorMessage = "gagal mengambil data user"
        this.loadingUsers=false
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
}
