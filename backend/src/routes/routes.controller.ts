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

  constructor(private readonly routesService: RoutesService) {
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
    const params = request.query as unknown as {
      cursor: Prisma.RouteWhereUniqueInput | undefined;
    };

    try {
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
