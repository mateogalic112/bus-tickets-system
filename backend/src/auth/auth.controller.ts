import {
  type Request,
  type Response,
  type NextFunction,
  Router,
} from "express";
import validationMiddleware from "../middleware/validationMiddleware";
import {
  LoginUserDto,
  RegisterUserDto,
  loginUserSchema,
  registerUserSchema,
} from "./auth.validation";
import AuthService from "./auth.service";

class AuthController {
  readonly path = "/auth";
  readonly router = Router();
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(registerUserSchema),
      this.register
    );

    this.router.post(
      `${this.path}/login`,
      validationMiddleware(loginUserSchema),
      this.login
    );

    this.router.post(`${this.path}/logout`, this.logout);
  }

  private register = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const registerData: RegisterUserDto = request.body;
    try {
      const createdUser = await this.authService.registerUser(registerData);
      const token = this.authService.createToken(createdUser);
      response.setHeader("Set-Cookie", [this.authService.createCookie(token)]);
      return response.json(createdUser);
    } catch (err) {
      next(err);
    }
  };

  private login = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const loginData: LoginUserDto = request.body;
    try {
      const foundUser = await this.authService.loginUser(loginData);
      const token = this.authService.createToken(foundUser);
      response.setHeader("Set-Cookie", [this.authService.createCookie(token)]);
      return response.json(foundUser);
    } catch (err) {
      next(err);
    }
  };

  private logout = (request: Request, response: Response) => {
    response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    response.send(200);
  };
}

export default AuthController;
