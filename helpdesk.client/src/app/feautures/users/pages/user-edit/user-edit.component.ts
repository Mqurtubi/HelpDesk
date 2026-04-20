import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { AuthService } from '../../../../core/services/auth.service'
import { UserService } from '../../../../core/services/user.service'
import { RoleService } from '../../../../core/services/role.service'
import { DepartmentService } from '../../../../core/services/department.service'
@Component({
  selector: 'app-user-edit',
  standalone: false,
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {
  form!: FormGroup;
  userId!: number;

  departments: { id: number, name: string }[] = [];
  roles: { id: number, name: string }[] = [];
  loading = false;
  pageLoading = false;
  errorMessage = '';
  successMessage = '';
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'))
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      departementId: [null, Validators.required],
      roleId: [null, Validators.required]
    })
    this.loadInitialData()
  }
  loadInitialData(): void {
    if (!this.userId) {
      this.errorMessage = "user id tidak ada"
      return;
    }
    this.pageLoading = true;
    this.errorMessage = ''
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response;
        this.roleService.getRoles().subscribe({
          next: (response) => {
            this.roles = response;
            this.loadUserDetail()
          },
          error: (error) => {
            this.pageLoading = false;
            this.errorMessage="gagal memuat role data"
          }
        })
      },
      error: (error) => {
        this.pageLoading = false;
        this.errorMessage='gagal memuat department data'
      }
    })
  }
  loadUserDetail(): void {
    this.userService.getUserByID(this.userId).subscribe({
      next: (response) => {
        this.form.patchValue({
          fullName: response.fullName,
          email: response.email,
          password: '',
          departementId: response.departmentId,
          roleId: response.roleId
        })
        this.pageLoading=false
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = error?.error?.message ?? "gagal muat data detail"
      }
    })
  }
  submitForm(): void {
    
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.userService.updateUser(this.userId, this.form.value).subscribe({
      next: (response) => {
        this.successMessage = "update user berhasil";
        this.loading = false;
        if (this.authService.getCurrentUserId() == response.id) {
          this.authService.refreshCurrentUser();
        }
        this.router.navigate(['/users', this.userId])
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = error?.error?.messagge ?? "gagal update user";
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
