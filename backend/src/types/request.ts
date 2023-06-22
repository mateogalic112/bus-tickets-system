import { User } from "@prisma/client";
import { Request } from "express";

export interface RequestWithUser extends Request {}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
