import { Prisma, PrismaClient, Ticket } from "@prisma/client";
import { BuyTicketDto } from "./tickets.validation";
import HttpException from "../exceptions/HttpException";
import { RESULTS_PER_PAGE } from "./tickets.constants";
import { RawUserTicket } from "./tickets.types";

class TicketsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public findTicketById = async (ticketId: number) => {
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

  public updateTicketById = async (ticketId: number, data: Partial<Ticket>) => {
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

  public getUserTickets = async (
    userId: number,
    cursor: Prisma.TicketWhereUniqueInput | undefined
  ): Promise<RawUserTicket[]> => {
    const parsedCursor = cursor ? { id: +cursor } : undefined;
    const skip = parsedCursor ? 1 : 0;

    const userTickets = await this.prisma.ticket.findMany({
      take: RESULTS_PER_PAGE,
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

    return userTickets;
  };

  public createTicket = async (
    buyTicketDto: BuyTicketDto,
    routeMaxTickets: number,
    userId: number
  ): Promise<Ticket> => {
    return await this.prisma.$transaction(async (tx) => {
      const ticketCountForRoute = await tx.ticket.count({
        where: {
          routeId: buyTicketDto.routeId,
          isCanceled: false,
        },
      });

      if (routeMaxTickets < ticketCountForRoute + 1) {
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

      return createdTicket;
    });
  };
}

export default TicketsRepository;
