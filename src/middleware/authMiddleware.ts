import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { AuthRequest } from "../types/globalTypes";
import { Role } from "@prisma/client";

class AuthMiddleware {
  async isAuthenticated(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token = req.headers.authorization;
    if (!token || token == undefined) {
      res.status(403).json({
        message: "Please Login",
      });
      return;
    }
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (error, decoded) => {
        if (error) {
          res.status(403).json({
            message: "Invalid Token",
          });
          return;
        }
        if (typeof decoded === "string" || !decoded || !("id" in decoded)) {
          res.status(403).json({
            message: "Malformed token payload",
          });
          return;
        }

        try {
          const userData = await prisma.user.findUnique({
            where: { id: decoded.id },
          });
          if (!userData) {
            res.status(404).json({
              message: "No user found with that token",
            });
            return;
          }
          req.user = userData;
          next();
        } catch (error) {
          res.status(500).json({
            message: "Something went wronggg",
          });
        }
      }
    );
  }

  allowTo(...roles: Role[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      let userRole = req?.user?.role as Role;
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "You don'thave permission",
        });
      } else {
        next();
      }
    };
  }
}

export default new AuthMiddleware();
