import {
  type Request,
  type Response,
  type NextFunction,
  Router,
} from "express";
import UsersService from "./users.service";
import authMiddleware from "../middleware/authMiddleware";

class UsersController {
  readonly path = "/users";
  readonly router = Router();
  private readonly usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}/me`, authMiddleware, this.getCurrentUser);
  }

  private getCurrentUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.user!.id;
      const currentUser = await this.usersService.getUserById(userId);
      return response.json(currentUser);
    } catch (err) {
      next(err);
    }
  };
}

export default UsersController;
