import { Prisma } from "@prisma/client";
import { InfiniteScrollResponse } from "../types/response";
import RoutesRepository from "./routes.repository";
import { RESULTS_PER_PAGE } from "./routes.constants";
import { parseActiveRoute } from "./routes.utils";
import { ActiveRoute } from "./routes.types";

class RoutesService {
  constructor(private readonly routesRepository: RoutesRepository) {}

  public getActiveRoutes = async (
    cursor: Prisma.RouteWhereUniqueInput | undefined
  ): Promise<InfiniteScrollResponse<ActiveRoute>> => {
    const rawActiveRoutes = await this.routesRepository.getActiveRoutes(cursor);

    const parsedActiveRoutes = rawActiveRoutes.map(parseActiveRoute);

    const lastRoute = rawActiveRoutes[RESULTS_PER_PAGE - 1];
    const nextCursor = lastRoute ? { id: lastRoute.id } : null;

    return { items: parsedActiveRoutes, nextCursor };
  };
}

export default RoutesService;
