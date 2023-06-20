import {
  type Request,
  type Response,
  type NextFunction,
  Router,
} from "express";
import validationMiddleware from "../middleware/validationMiddleware";
import { registerUserSchema } from "./auth.validation";
import { RegisterUserDto } from "./auth.dto";
import AuthService from "./auth.service";
import PrismaService from "../services/prismaService";
import HttpException from "../exceptions/HttpException";

class AuthController {
  readonly path = "/auth";
  readonly router = Router();
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService(PrismaService.getPrisma());
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(registerUserSchema),
      this.registerUser
    );
  }

  private registerUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const registerData: RegisterUserDto = request.body;
    try {
      const createdUser = await this.authService.registerUser(registerData);
      if (!createdUser) {
        throw new HttpException(500, "Error while creating user.");
      }
      const token = this.authService.createToken(createdUser);
      response.setHeader("Set-Cookie", [this.authService.createCookie(token)]);
      return response.json(createdUser);
    } catch (err) {
      next(err);
    }
  };
}

export default AuthController;
