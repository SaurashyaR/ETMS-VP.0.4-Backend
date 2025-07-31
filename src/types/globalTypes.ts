import { Role } from "@prisma/client";
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    password: string;
    role: Role;
    firstName: string | null;
    lastName: string | null;
    mobileNumber: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number | null;
    updatedBy: number | null;
    isActive: boolean;
  };
}
