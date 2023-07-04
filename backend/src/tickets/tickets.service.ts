import { Prisma, PrismaClient, Ticket } from "@prisma/client";
import { BuyTicketDto } from "./tickets.validation";
import HttpException from "../exceptions/HttpException";
import RoutesService from "../routes/routes.service";
import { InfiniteScrollResponse } from "../types/response";
import { UserTicket } from "../types/ticket";
import { differenceInHours } from "date-fns";

class TicketsService {
  private readonly prisma: PrismaClient;
  private readonly routesService: RoutesService;

  constructor(prisma: PrismaClient, routesService: RoutesService) {
    this.prisma = prisma;
    this.routesService = routesService;
  }

  private findTicketById = async (ticketId: number) => {
    const foundTicket = await this.prisma.ticket.findFirst({
      where: { id: ticketId },
      include: {
        Route: {
          select: {
            startsAt: true,
          },
        },
      },
    });

    if (!foundTicket) {
      throw new HttpException(404, "Ticket not found.");
    }

    return foundTicket;
  };

  private updateTicketById = async (
    ticketId: number,
    data: Partial<Ticket>
  ) => {
    const updatedTicket = await this.prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data,
    });

    if (!updatedTicket) {
      throw new HttpException(500, "Ticket update failed.");
    }

    return updatedTicket;
  };

  public cancelTicket = async (userId: number, ticketId: number) => {
    const ALLOWED_CANCEL_PERIOD_IN_HOURS = 1;

    const foundTicket = await this.findTicketById(ticketId);

    if (foundTicket.userId !== userId) {
      throw new HttpException(404, "Ticket not owned.");
    }

    if (foundTicket.isCanceled) {
      throw new HttpException(400, "Ticket already canceled.");
    }

    const hoursUntilDepartureStarts = differenceInHours(
      new Date(foundTicket.Route!.startsAt),
      new Date()
    );

    if (hoursUntilDepartureStarts < ALLOWED_CANCEL_PERIOD_IN_HOURS) {
      throw new HttpException(400, "Cancel period has passed.");
    }

    const updatedTicket = await this.updateTicketById(ticketId, {
      isCanceled: true,
    });

    if (!updatedTicket) {
      throw new HttpException(500, "Ticket cancel update failed.");
    }

    return updatedTicket;
  };

  public getUserTickets = async (
    userId: number,
    cursor: Prisma.TicketWhereUniqueInput | undefined
  ): Promise<InfiniteScrollResponse<UserTicket>> => {
    const PER_PAGE = 5;
    const parsedCursor = cursor ? { id: +cursor } : undefined;
    const skip = parsedCursor ? 1 : 0;

    const userTickets = await this.prisma.ticket.findMany({
      take: PER_PAGE,
      skip,
      cursor: parsedCursor,
      where: {
        userId,
        isCanceled: false,
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
      isCancelled: ticket.isCanceled,
    }));

    const lastTicket = userTickets[PER_PAGE - 1];
    const nextCursor = lastTicket ? { id: lastTicket.id } : null;
    return { items: parsedUserTickets, nextCursor };
  };

  public createTicket = async (
    buyTicketDto: BuyTicketDto,
    userId: number
  ): Promise<UserTicket> => {
    return await this.prisma.$transaction(async (tx) => {
      const ticketRoute = await this.routesService.getRouteById(
        buyTicketDto.routeId
      );

      const ticketCountForRoute = await tx.ticket.count({
        where: {
          routeId: buyTicketDto.routeId,
          isCanceled: false,
        },
      });

      if (ticketRoute.maxTickets < ticketCountForRoute + 1) {
        throw new HttpException(400, "No tickets left");
      }

      const createdTicket = await tx.ticket.create({
        data: {
          price: buyTicketDto.price,
          routeId: buyTicketDto.routeId,
          userId,
        },
      });

      if (!createdTicket) {
        throw new HttpException(500, "Error while creating ticket.");
      }

      return {
        id: createdTicket.id,
        price: createdTicket.price,
        name: ticketRoute!.name,
        startsAt: ticketRoute!.startsAt,
        endsAt: ticketRoute!.endsAt,
        isCancelled: createdTicket.isCanceled,
      };
    });
  };
}

export default TicketsService;
