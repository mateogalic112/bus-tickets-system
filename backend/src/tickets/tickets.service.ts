import { Prisma } from "@prisma/client";
import { BuyTicketDto } from "./tickets.validation";
import HttpException from "../exceptions/HttpException";
import RoutesService from "../routes/routes.service";
import { InfiniteScrollResponse } from "../types/response";
import { differenceInHours } from "date-fns";
import TicketsRepository from "./tickets.repository";
import { RESULTS_PER_PAGE } from "./tickets.constants";
import { constructUserTicketFrom, parseUserTicket } from "./tickets.utils";
import { UserTicket } from "./tickets.types";

class TicketsService {
  private readonly ticketsRepository: TicketsRepository;
  private readonly routesService: RoutesService;

  constructor(
    ticketsRepository: TicketsRepository,
    routesService: RoutesService
  ) {
    this.ticketsRepository = ticketsRepository;
    this.routesService = routesService;
  }

  public cancelTicket = async (userId: number, ticketId: number) => {
    const ALLOWED_CANCEL_PERIOD_IN_HOURS = 1;

    const foundTicket = await this.ticketsRepository.findTicketById(ticketId);

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

    const updatedTicket = await this.ticketsRepository.updateTicketById(
      ticketId,
      {
        isCanceled: true,
      }
    );

    if (!updatedTicket) {
      throw new HttpException(500, "Ticket cancel update failed.");
    }

    return updatedTicket;
  };

  public getUserTickets = async (
    userId: number,
    cursor: Prisma.TicketWhereUniqueInput | undefined
  ): Promise<InfiniteScrollResponse<UserTicket>> => {
    const rawUserTickets = await this.ticketsRepository.getUserTickets(
      userId,
      cursor
    );

    const lastTicket = rawUserTickets[RESULTS_PER_PAGE - 1];
    const nextCursor = lastTicket ? { id: lastTicket.id } : null;

    const parsedUserTickets = rawUserTickets.map(parseUserTicket);

    return { items: parsedUserTickets, nextCursor };
  };

  public createTicket = async (
    buyTicketDto: BuyTicketDto,
    userId: number
  ): Promise<UserTicket> => {
    const ticketRoute = await this.routesService.getRouteById(
      buyTicketDto.routeId
    );

    const createdTicket = await this.ticketsRepository.createTicket(
      buyTicketDto,
      ticketRoute.maxTickets,
      userId
    );

    const parsedUserTicket = constructUserTicketFrom(
      createdTicket,
      ticketRoute
    );

    return parsedUserTicket;
  };
}

export default TicketsService;
