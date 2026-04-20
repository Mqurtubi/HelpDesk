import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { TicketService } from '../../../../core/services/ticket.service'
@Component({
  selector: 'app-ticket-edit',
  standalone: false,
  templateUrl: './ticket-edit.component.html',
  styleUrl: './ticket-edit.component.css'
})
export class TicketEditComponent implements OnInit {
  ticketId!: number
  form!: FormGroup
  formData = {
    title: '',
    description: '',
    priority:'Medium'
  }
  loading = false
  loadingTicket = false
  errorMessage=''

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit():void {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'))
    if (!this.ticketId) {
      this.errorMessage = "gagal ambil ticket id"
      return;
    }

    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required]
    })
    this.loadTicket()
  }

  loadTicket(): void {
    this.loadingTicket = true
    this.errorMessage = ''

    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (response) => {
        this.form.patchValue({
          title: response.title,
          description: response.description,
          priority: response.priority
        })
        this.loadingTicket=false
      },
      error: (error) => {
        console.log(error)
        this.errorMessage = 'gagal mengambil data ticket'
        this.loadingTicket=false
      }
    })
  }
  submitForm(): void {
    this.errorMessage = ''
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true
    this.ticketService.updateTicket(this.ticketId, this.form.value).subscribe({
      next: (response) => {
        this.loading = false
        this.router.navigate(['/tickets', this.ticketId])
      },
      error: (error) => {
        console.log(error)
        this.errorMessage = 'gagal edit ticket'
        this.loading=false
      }
    })
  }
  get title() {
    return this.form.get('title')
  }
  get description() {
    return this.form.get('description')
  }
  get priority() {
    return this.form.get('priority')
  }
}
