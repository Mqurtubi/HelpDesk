import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model'
import { UserService } from '../../../../core/services/user.service'
@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  paginationUsers: User[] = [];

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  loading = false;
  errorMessage = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response;
        this.paginationUsers = response;
        this.currentPage = 1;
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = 'gagal dapat data user';
        this.loading = false
      }
    })
  }
  updatePagination(): void {
    this.totalPages = Math.ceil(this.users.length / this.pageSize) || 1
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginationUsers = this.users.slice(startIndex, endIndex);
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
    return Array.from({ length: this.totalPages }, (_, i) => i + 1)
  }
}
