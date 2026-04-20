import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { UserService } from '../../../../core/services/user.service'
import { DepartmentService } from '../../../../core/services/department.service'
import { RoleService } from '../../../../core/services/role.service'
@Component({
  selector: 'app-user-create',
  standalone: false,
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit {
  form!: FormGroup

  departments: { id: number, name: string }[] = [];
  roles: { id: number, name: string }[] = [];

  loading = false;
  pageLoading = false;
  errorMessage = '';
  successMessage = '';
  constructor(
    private userService: UserService,
    private departmentService: DepartmentService,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      departementId: [null, Validators.required],
      roleId: [null, Validators.required]
    });
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.pageLoading = true;
    this.errorMessage = ''
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response;
        this.roleService.getRoles().subscribe({
          next: (response) => {
            this.roles = response;
            this.pageLoading = false;
          },
          error: (error) => {
            console.log(error);
            this.pageLoading = false;
          }
        })
      },
      error: (error) => {
        console.log(error);
        this.pageLoading = false;
      }
    })
  }

  submitForm(): void {
    this.errorMessage = "";
    this.successMessage = "";
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }
    this.loading = true
    this.userService.createUsers(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = "user berhasil ditambahkan"
        this.form.reset();
      },
      error: (error) => {
        console.log(error)
        this.errorMessage = error.error ? error.error.message : "gagal membuat user";
        this.loading = false;
      }
    })
  }
  goBack(): void {
    this.router.navigate(['/users']);
  }

  get fullName() {
    return this.form.get('fullName');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get departementId() {
    return this.form.get('departementId');
  }

  get roleId() {
    return this.form.get('roleId');
  }
}
