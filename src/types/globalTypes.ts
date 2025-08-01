import { Request } from "express";

export interface AuthRequest extends Request {
  user?:
    | {
        id: number;
        email: string;
        password: string;
        role: Roles;
        firstName: string | null;
        lastName: string | null;
        mobileNumber: string | null;
        createdAt: Date;
        updatedAt: Date;
        createdBy: number | null;
        updatedBy: number | null;
        isActive: boolean;
      }
    | undefined;
}

export enum Roles {
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER",
  GUEST = "GUEST",
}
