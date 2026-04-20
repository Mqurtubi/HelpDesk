export interface LoginResponse {
  id: number;
  token: string;
  fullName: string;
  email: string;
  roleName: string;
  departmentName: string;
  expiredAt: string;
}
