export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  createdByUserId: number;
  createdByUserName: string;
  departmentName: string;
  roleName: string;
}
