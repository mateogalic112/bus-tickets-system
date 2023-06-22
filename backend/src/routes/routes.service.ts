import { Prisma, PrismaClient } from "@prisma/client";
import { InfiniteScrollResponse } from "../types/response";
import HttpException from "../exceptions/HttpException";
import { ActiveRoute } from "../types/route";

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
  ): Promise<InfiniteScrollResponse<ActiveRoute>> => {
    const PER_PAGE = 5;
    const parsedCursor = cursor ? { id: +cursor } : undefined;
    const skip = parsedCursor ? 1 : 0;

    const routes = await this.prisma.route.findMany({
      take: PER_PAGE,
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

    const parsedRoutes = routes.map((route) => ({
      id: route.id,
      basePrice: route.basePrice,
      name: route.name,
      startsAt: route.startsAt,
      endsAt: route.endsAt,
      maxTickets: route.maxTickets,
      transporter: route.transporter,
      ticketCount: route.tickets.length,
    }));

    const lastRoute = routes[PER_PAGE - 1];
    const nextCursor = lastRoute ? { id: lastRoute.id } : null;
    return { items: parsedRoutes, nextCursor };
  };
}

export default RoutesService;
