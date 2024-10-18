export type UserType = 'user' | 'admin' | 'driver';

export interface User {
  id: string;
  name?: string;
  email?: string;
  role: UserType,
  phone?: string;
  address?: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}