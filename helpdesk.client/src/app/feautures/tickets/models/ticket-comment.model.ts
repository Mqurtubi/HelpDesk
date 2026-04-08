export interface TicketComment {
  id: number;
  ticketId: number;
  userId: number;
  userName: string;
  message: string;
  createdAt: string;
}
