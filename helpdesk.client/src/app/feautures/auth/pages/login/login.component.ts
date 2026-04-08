import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { AuthService } from '../../../../core/services/auth.service'
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formData = {
    email: '',
    password:''
  }
  errorMessage = ''
  loading = false
  constructor(private authService: AuthService, private router: Router) { }

  submitForm(): void{
    this.errorMessage = '';
    this.loading = true;
    this.authService.login(this.formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/dashboard'])
      },
      error: (error) => {
        console.log(error)
        this.loading = false
        this.errorMessage='email atau password salah'
      }
    })
  }

}
