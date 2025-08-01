import { Roles } from "./globalTypes";
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  mobileNumber: string;
  role?: Roles;
}

export interface LoginData {
  email: string;
  password: string;
}
