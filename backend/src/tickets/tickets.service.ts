import { Prisma, PrismaClient } from "@prisma/client";
import { BuyTicketDto } from "./tickets.validation";
import HttpException from "../exceptions/HttpException";
import RoutesService from "../routes/routes.service";
import { InfiniteScrollResponse } from "../types/response";
import { UserTicket } from "../types/ticket";

class TicketsService {
  private readonly prisma: PrismaClient;
  private readonly routesService: RoutesService;

  constructor(prisma: PrismaClient, routesService: RoutesService) {
    this.prisma = prisma;
    this.routesService = routesService;
  }

  public getUserTickets = async (
    userId: number,
    cursor: Prisma.TicketWhereUniqueInput | undefined
  ): Promise<InfiniteScrollResponse<UserTicket>> => {
    const take = 5;
    const parsedCursor = cursor ? { id: +cursor } : undefined;
    const skip = parsedCursor ? 1 : 0;

    const userTickets = await this.prisma.ticket.findMany({
      take,
      skip,
      cursor: parsedCursor,
      where: {
        userId,
      },
      orderBy: {
        id: "asc",
      },
      include: {
        Route: {
          select: { name: true, startsAt: true, endsAt: true },
        },
      },
    });

    const parsedUserTickets = userTickets.map((ticket) => ({
      id: ticket.id,
      price: ticket.price,
      name: ticket.Route!.name,
      startsAt: ticket.Route!.startsAt,
      endsAt: ticket.Route!.endsAt,
    }));

    const lastTicket = userTickets[take - 1];
    const nextCursor = lastTicket ? { id: lastTicket.id } : null;
    return { items: parsedUserTickets, nextCursor };
  };

  public createTicket = async (buyTicketDto: BuyTicketDto, userId: number) => {
    await this.checkCurrentTicketCount(buyTicketDto.routeId);

    const createdTicket = await this.prisma.ticket.create({
      data: {
        ...buyTicketDto,
        userId,
      },
    });

    if (!createdTicket) {
      throw new HttpException(500, "Error while creating ticket.");
    }

    return createdTicket;
  };

  private checkCurrentTicketCount = async (routeId: number) => {
    const ticketRoute = await this.routesService.getRouteById(routeId);

    const ticketCountForRoute = await this.prisma.ticket.count({
      where: {
        routeId: routeId,
      },
    });

    if (ticketRoute.maxTickets <= ticketCountForRoute + 1) {
      throw new HttpException(400, "No tickets left");
    }
  };
}

export default TicketsService;
