import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { TicketComment } from '../../feautures/tickets/models/ticket-comment.model'
import { Ticket } from '../../feautures/tickets/models/ticket.model';

export interface CreateTicketCommentRequest {
  ticketId: number;
  userId: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketCommentService {
  private apiUrl = '/api/TicketComment'
  constructor(private http: HttpClient) { }
  getCommentByTicketId(ticketId: number): Observable<TicketComment[]> {
    return this.http.get<TicketComment[]>(`${this.apiUrl}/ticket/${ticketId}`)
  }
  createComment(payload: CreateTicketCommentRequest): Observable<TicketComment> {
    return this.http.post<TicketComment>(this.apiUrl, payload);
  }
}
