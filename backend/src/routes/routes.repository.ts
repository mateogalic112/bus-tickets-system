import { Prisma, PrismaClient } from "@prisma/client";
import HttpException from "../exceptions/HttpException";
import { RawActiveRoute } from "./routes.types";
import { RESULTS_PER_PAGE } from "./routes.constants";

class RoutesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public getRouteById = async (routeId: number) => {
    const foundRoute = await this.prisma.route.findFirst({
      where: { id: routeId },
    });

    if (!foundRoute) {
      throw new HttpException(404, "Route not found.");
    }

    return foundRoute;
  };

  public getActiveRoutes = async (
    cursor: Prisma.RouteWhereUniqueInput | undefined
  ): Promise<RawActiveRoute[]> => {
    const parsedCursor = cursor ? { id: +cursor } : undefined;
    const skip = parsedCursor ? 1 : 0;

    const activeRoutes = await this.prisma.route.findMany({
      take: RESULTS_PER_PAGE,
      skip,
      cursor: parsedCursor,
      where: {
        startsAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        startsAt: "asc",
      },
      include: {
        tickets: { where: { isCanceled: false }, select: { id: true } },
      },
    });

    return activeRoutes;
  };
}

export default RoutesRepository;
