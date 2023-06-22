import { PrismaClient } from "@prisma/client";
import { BuyTicketDto } from "./tickets.validation";
import HttpException from "../exceptions/HttpException";
import RoutesService from "../routes/routes.service";

class TicketsService {
  private readonly prisma: PrismaClient;
  private readonly routesService: RoutesService;

  constructor(prisma: PrismaClient, routesService: RoutesService) {
    this.prisma = prisma;
    this.routesService = routesService;
  }

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
