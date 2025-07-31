import { Role } from "@prisma/client";
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  mobileNumber: string;
  role?: Role;
}

export interface LoginData {
  email: string;
  password: string;
}
