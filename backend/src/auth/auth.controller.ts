import express from "express";
import validationMiddleware from "../middleware/validationMiddleware";
import { registerUserSchema } from "./auth.validation";
import { RegisterUserDto } from "./auth.dto";
import AuthService from "./auth.service";
import PrismaService from "../services/prismaService";

class AuthController {
  readonly path = "/auth";
  readonly router = express.Router();
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
    request: express.Request,
    response: express.Response
  ) => {
    const registerData: RegisterUserDto = request.body;
    try {
      const createdUser = await this.authService.registerUser(registerData);
      if (!createdUser) {
        return;
      }
      const token = this.authService.createToken(createdUser);
      response.setHeader("Set-Cookie", [this.authService.createCookie(token)]);
      return response.json(createdUser);
    } catch (err) {}
  };
}

export default AuthController;
