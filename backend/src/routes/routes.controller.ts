import {
  type Request,
  type Response,
  type NextFunction,
  Router,
} from "express";
import RoutesService from "./routes.service";
import { Prisma } from "@prisma/client";

class RoutesController {
  readonly path = "/routes";
  readonly router = Router();
  private readonly routesService: RoutesService;

  constructor(routesService: RoutesService) {
    this.routesService = routesService;
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}`, this.getActiveRoutes);
  }

  private getActiveRoutes = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const params = request.query as unknown as {
        cursor: Prisma.RouteWhereUniqueInput | undefined;
      };
      const activeRoutes = await this.routesService.getActiveRoutes(
        params.cursor
      );
      return response.json(activeRoutes);
    } catch (err) {
      next(err);
    }
  };
}

export default RoutesController;
