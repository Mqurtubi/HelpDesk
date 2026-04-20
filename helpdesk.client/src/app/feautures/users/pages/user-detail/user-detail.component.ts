import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service'
import { User } from '../../models/user.model';
@Component({
  selector: 'app-user-detail',
  standalone: false,
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {
  user: User | null = null
  loading = false
  deleteLoading = false
  errorMessage = ''

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    if (!userId) {
      this.errorMessage = 'id user tidak valid'
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.userService.getUserByID(userId).subscribe({
      next: (response) => {
        this.user = response;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? "gagal memuat data user"
      }
    })
  }
  deleteUser(): void {
    if (!this.user) {
      return;
    }
    const confirmed = window.confirm(`hapus user ${this.user.fullName}? `)
    if (!confirmed) {
      return;
    }
    this.deleteLoading = true
    this.errorMessage=''
    this.userService.deleteUser(this.user.id).subscribe({
      next: (response) => {
        this.deleteLoading = false
        this.router.navigate(['/users'])
      },
      error: (error) => {
        this.deleteLoading = false
        this.errorMessage=error?.error?.message??'gaga delete user'
      }
    })
  }
  goBack(): void {
    this.router.navigate(['/users']);
  }
  goToEdit(): void {
    if (!this.user) {
      return;
    }
    this.router.navigate(['/users', this.user.id,'edit'])
  }
  canDelete(): boolean {
    return this.authService.isAdmin();
  }
}
