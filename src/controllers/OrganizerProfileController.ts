import { Request, Response } from "express";
import { AuthRequest } from "../types/globalTypes";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";

interface OrganizationRegistrationData {
  email: string;
  password: string;
  organizerName: string;
}

interface OrganizerProfile {
  id: number;
  userId: number;
  organizerName: string;
  accountId?: string | null;
  logo?: string | null;
  isVerified: boolean;
  verifiedOn?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: number | null;
  updatedBy?: number | null;
  isActive?: boolean;
}
class OrganizerProfileController {
  async createOrganizerProfile(req: AuthRequest, res: Response): Promise<void> {
    const { email, password, organizerName }: OrganizationRegistrationData =
      req.body;

    if (!organizerName || !email || !password) {
      res.status(400).json({
        message: "email, organization name and password are required",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(400).json({
        message: "This email is already in use",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: { email, password: hashedPassword, role: "ORGANIZER" },
      });

      const profile: OrganizerProfile = await tx.organizerProfile.create({
        data: {
          organizerName,
          userId: user.id,
          createdBy: user.id,
          updatedBy: user.id,
          isVerified: false,
        },
      });

      await tx.auditLog.create({
        data: { userId: user.id, action: "Organizer_Profile_Created" },
      });

      return { user, profile };
    });

    res.status(200).json({
      message: "Organizer registration successfully",
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
        profile: result.profile,
      },
    });
  }
}

export default new OrganizerProfileController();
