import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginData, RegisterData } from "../types/userTypes";
import prisma from "../config/prisma";
import { AuthRequest } from "../types/globalTypes";

class UserController {
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        mobileNumber,
        role,
      }: RegisterData = req.body;

      if (!email || !password || !firstName || !mobileNumber) {
        res.status(400).json({
          message:
            "Please provide email, passowrd, firstname and mobile number",
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
          message:
            "user with this email already exist, please use unique email address",
        });
        return;
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
          firstName,
          lastName,
          mobileNumber,
          role,
          isActive: true,
        },
      });
      await prisma.auditLog.create({
        data: {
          userId: newUser.id,
          action: "User_Registered",
        },
      });
      res.status(201).json({
        message: "User Registered successfully",
        data: newUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error!!!",
      });
      console.log("error", error);
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password }: LoginData = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password",
      });
      return;
    }
    const userFound = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        organizerProfile: {
          select: {
            id: true,
            organizerName: true,
            isVerified: true,
          },
        },
      },
    });
    if (!userFound) {
      res.status(404).json({
        message: "No user found with this email",
      });
      return;
    }
    if (!userFound.isActive) {
      res.status(403).json({
        message: "User is not active",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compareSync(
      password,
      userFound.password
    );
    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid Password",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: userFound.id,
        email: userFound.email,
        role: userFound.role,
      },
      process.env.SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );

    await prisma.auditLog.create({
      data: {
        userId: userFound.id,
        action: "User_Logged_In",
      },
    });

    const userData = {
      id: userFound.id,
      email: userFound.email,
      role: userFound.role,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      mobileNumber: userFound.mobileNumber,
      organizerProfile: userFound.organizerProfile,
    };

    res.status(200).json({
      message: "LoggedIn successfully",
      data: {
        token,
        user: userData,
      },
    });
  }

  async getYourProfile(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({
        message: "No userId found",
      });
      return;
    }
    const userFound = await prisma.user.findMany({
      where: {
        id: userId,
      },
    });
    if (userFound.length === 0) {
      res.status(404).json({
        message: "No user found",
      });
      return;
    }
    res.status(200).json({
      message: "User fetched successfully",
      data: userFound,
    });
    await prisma.auditLog.create({
      data: {
        userId: userId,
        action: "USER_PROFILE_FETCHED",
      },
    });
  }
}

export default new UserController();
