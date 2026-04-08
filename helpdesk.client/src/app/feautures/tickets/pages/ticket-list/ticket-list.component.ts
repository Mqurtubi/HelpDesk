import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket.model'
import { TicketService } from '../../../../core/services/ticket.service'

@Component({
  selector: 'app-ticket-list',
  standalone: false,
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  paginationTickets: Ticket[] = [];

  searchTerm = '';
  selectedStatus = '';
  selectedPriority = '';

  currentPage = 1;
  pageSize = 2;
  totalPages = 1;

  loading = false;
  errorMessage = '';


  constructor(private ticketService: TicketService) { }

  ngOnInit():void {
    this.loadTickets();
  }
  loadTickets(): void {
    this.loading = true;
    this.errorMessage = '';

    this.ticketService.getTickets().subscribe({
      next: (response) => {
        this.tickets = response;
        this.filteredTickets = response;
        this.currentPage = 1;
        this.updatePagination();
        this.loading = false
      },
      error: (error) => {
        console.log(error)
        this.errorMessage = "gagal mengambil data ticket dari server"
        this.loading = false
      }
    })
  }
  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      const matchesSearch = !this.searchTerm || ticket.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.selectedStatus || ticket.status === this.selectedStatus;
      const matchesPriority = !this.selectedPriority || ticket.priority === this.selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority
    })
    this.currentPage = 1;
    this.updatePagination()
  }
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedPriority = ''
    this.filteredTickets = [...this.tickets];
    this.updatePagination()
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredTickets.length / this.pageSize) || 1
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginationTickets = this.filteredTickets.slice(startIndex, endIndex);
  }
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagination();
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination()
    }
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination()
    }
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages },(_,i)=>i+1)
  }
}
