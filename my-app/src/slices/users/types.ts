export interface CreateUserData {
  name: string;
  email: string;
  role: 'Admin' | 'IT Support Agent' | 'Department Manager' | 'End User';
  department: string;
  password: string;
  isActive: boolean;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
}

export interface UserFilters {
  role?: string;
  department?: string;
  isActive?: boolean;
  search?: string;
}

export interface UserTableColumn {
  id: keyof User | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string;
}

export interface UserFormErrors {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  password?: string;
}