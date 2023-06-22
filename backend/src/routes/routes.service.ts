import { Prisma, PrismaClient, Route } from "@prisma/client";
import { InfiniteScrollResponse } from "../types/response";
import { RouteWithTicketCount } from "./routes.dto";
import HttpException from "../exceptions/HttpException";

class RoutesService {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

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
  ): Promise<InfiniteScrollResponse<RouteWithTicketCount>> => {
    const take = 5;
    const parsedCursor = cursor ? { id: +cursor } : undefined;
    const skip = parsedCursor ? 1 : 0;

    const routes = await this.prisma.route.findMany({
      take,
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
        _count: {
          select: { tickets: true },
        },
      },
    });

    const parsedRoutes = routes.map((route) => ({
      ...route,
      ticketCount: route._count.tickets,
    }));

    const lastRoute = routes[take - 1];
    const nextCursor = lastRoute ? { id: lastRoute.id } : null;
    return { items: parsedRoutes, nextCursor };
  };
}

export default RoutesService;
