export enum UserRole {
  User = "User",
  Admin = "Admin"
}

export interface UserWithRole {
  id: string;
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  countryCode?: string;
  gender?: string;
  role?: string;
  roles: string[];
  createdAt: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  countryCode?: string;
  gender?: string;
  roles: string[];
  createdAt?: string;
}

export interface UpdateUserRoleRequest {
  userId?: string; // Optional, as it's in the URL path
  role: string; // "Admin" or "User" - backend expects a string
}
