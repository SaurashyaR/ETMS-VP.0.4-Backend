import { Request, Response } from "express";
import { AuthRequest } from "../types/globalTypes";
import prisma from "../config/prisma";

class OrganizerProfileController {
  async createOrganizerProfile(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        message: "You're Not Authorizwed",
      });
      return;
    }

    const { organizerName, accountId } = req.body;

    if (!organizerName || !accountId) {
      res.status(400).json({
        message: "Organizer name and account id are required",
      });
      return;
    }

    const existingAccount = await prisma.organizerProfile.findFirst({
      where: {
        accountId,
        NOT: {
          userId,
        },
      },
    });

    if (existingAccount) {
      res.status(400).json({
        message: "Account ID already in use by another organizer",
      });
      return;
    }

    const existingProfile = await prisma.organizerProfile.findUnique({
      where: { userId },
    });

    let profile;
    if (existingProfile) {
      profile = await prisma.organizerProfile.update({
        where: { userId },
        data: {
          organizerName,
          accountId,
          updatedBy: userId,
        },
      });
    } else {
      profile = await prisma.organizerProfile.create({
        data: {
          organizerName,
          accountId,
          userId,
          createdBy: userId,
          updatedBy: userId,
        },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { role: "ORGANIZER" },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId,
        action: existingProfile
          ? "Organizer_Profile_Updated"
          : "Organizer_Profile_Created",
      },
    });

    res.status(200).json({
      message: "Organizer profile processed successfully",
      data: profile,
    });
  }
}

export default new OrganizerProfileController();
