import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { TicketService } from '../../../../core/services/ticket.service'
import { UserService } from '../../../../core/services/user.service'
import { AuthService } from '../../../../core/services/auth.service'
import { User } from '../../../users/models/user.model';
@Component({
  selector: 'app-ticket-create',
  standalone: false,
  templateUrl: './ticket-create.component.html',
  styleUrl: './ticket-create.component.css'
})
export class TicketCreateComponent implements OnInit {
  form!: FormGroup;
  
  loading = false;
  errorMessage = '';
  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['Medium', Validators.required],
      createdByUserId: this.authService.getCurrentUserId()
    });
    console.log(this.authService.getCurrentUserId())
  }

  submitForm(): void {
    this.errorMessage = ''
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }
    this.loading = true;
    this.ticketService.createTicket(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset();
        this.router.navigate(['/tickets']);
      },
      error: (error) => {
        console.log(error)
        this.errorMessage = "gagal membuat ticket"
        this.loading = false
      }
    })
  }
  get title() {
    return this.form.get("title")
  }
  get description() {
    return this.form.get("description")
  }
  get priority() {
    return this.form.get("priority")
  }
}
