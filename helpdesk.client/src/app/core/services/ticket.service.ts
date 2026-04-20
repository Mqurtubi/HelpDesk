import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Ticket } from '../../feautures/tickets/models/ticket.model'

interface CreateTicketRequest {
  title: string;
  description: string;
  priority: string;
  createdByUserId: number;
}
export interface UpdateTicketRequest {
  title: string;
  description: string;
  priority: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = '/api/Tickets'

  constructor(private http: HttpClient) { }

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl)
  }
  createTicket(payload: CreateTicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, payload)
  }
  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`)
  }
  updateTicket(id: number, payload: UpdateTicketRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload)
  }
  updateTicketStatus(id: number, payload: { status: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, payload)
  }
  deleteTicket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}
