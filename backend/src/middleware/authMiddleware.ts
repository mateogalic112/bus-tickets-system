import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";
import { RequestWithUser } from "../types/request";
import jwtConfig from "../config/jwt";
import HttpException from "../exceptions/HttpException";
import UsersService from "../users/users.service";
import PrismaService from "../services/prismaService";

async function authMiddleware(
  request: Request,
  _: Response,
  next: NextFunction
) {
  const requestWithUser = request as RequestWithUser;

  const cookies = requestWithUser.cookies;
  if (!cookies && !cookies.Authorization) {
    next(new HttpException(403, "No token found!"));
  }

  try {
    const usersService = new UsersService(PrismaService.getPrisma());

    const { userId } = jwt.verify(cookies.Authorization, jwtConfig.secret) as {
      userId: number;
    };

    const user = await usersService.getUserById(userId);
    if (!user) {
      next(new HttpException(400, "Wrong credentials!"));
    }

    requestWithUser.user = user;
    next();
  } catch (_) {
    next(new HttpException(400, "Wrong credentials!"));
  }
}

export default authMiddleware;
