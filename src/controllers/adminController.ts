import { AuthRequest } from "../types/globalTypes";
import { Response } from "express";
import prisma from "../config/prisma";

class AdminController {
  async getAllOrganizer(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const organizer = await prisma.organizerProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            mobileNumber: true,
            createdAt: true,
            isActive: true,
          },
        },
      },
    });
    if (organizer.length === 0) {
      res.status(404).json({
        message: "No organizer found",
      });
      return;
    }
    res.status(200).json({
      message: "Organizer Profile fetched successfully",
      data: organizer,
    });
    if (userId !== undefined) {
      await prisma.auditLog.create({
        data: {
          userId: userId,
          action: "ALL_ORGANIZER_FETCHED",
        },
      });
    }
  }
  async getVerifiedOrganizer(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const organizer = await prisma.organizerProfile.findMany({
      where: {
        isVerified: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            mobileNumber: true,
            createdAt: true,
            isActive: true,
          },
        },
      },
    });
    if (organizer.length === 0) {
      res.status(404).json({
        message: "No organizer found",
      });
      return;
    }
    res.status(200).json({
      message: "Verified Organizer's profile fetched successfully",
      data: organizer,
    });
    if (userId !== undefined) {
      await prisma.auditLog.create({
        data: {
          userId: userId,
          action: "ALL_ORGANIZER_FETCHED",
        },
      });
    }
  }

  async verifyOrganizer(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { organizerId } = req.params;
    if (!userId || req.user?.role !== "ADMIN") {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }
    const organizerIdNum = Number(organizerId);
    if (isNaN(organizerIdNum)) {
      res.status(400).json({
        message: "Invalid organizer ID",
      });
      return;
    }
    const organizer = await prisma.organizerProfile.findMany({
      where: {
        id: parseInt(organizerId),
      },
    });
    if (organizer.length === 0) {
      res.status(404).json({
        message: "Organizer Not Found with given Id",
      });
      return;
    }
    const updatedOrganizer = await prisma.organizerProfile.update({
      where: { id: parseInt(organizerId) },
      data: {
        isVerified: true,
        verifiedOn: new Date(),
        updatedBy: userId,
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: userId,
        action: `Organizer_Verified_${organizerId}`,
      },
    });

    res.status(200).json({
      message: "Organizer verified successfully",
      data: updatedOrganizer,
    });
  }

  async rejectOrganizer(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { organizerId } = req.params;
    if (!userId || req.user?.role !== "ADMIN") {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }
    const organizerIdNum = Number(organizerId);
    if (isNaN(organizerIdNum)) {
      res.status(400).json({
        message: "Invalid organizer ID",
      });
      return;
    }
    const organizer = await prisma.organizerProfile.findMany({
      where: {
        id: parseInt(organizerId),
      },
    });
    if (organizer.length === 0) {
      res.status(404).json({
        message: "Organizer Not Found with given Id",
      });
      return;
    }
    const updatedOrganizer = await prisma.organizerProfile.update({
      where: { id: parseInt(organizerId) },
      data: {
        isVerified: false,
        verifiedOn: new Date(),
        updatedBy: userId,
        isActive: false,
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: userId,
        action: `Organizer_Rejected_${organizerId}`,
      },
    });

    res.status(200).json({
      message: "Organizer Rejected successfully",
      data: updatedOrganizer,
    });
  }
}

export default new AdminController();
