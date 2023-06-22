import { PrismaClient } from "@prisma/client";
import { BuyTicketDto } from "./tickets.validation";
import HttpException from "../exceptions/HttpException";

class TicketsService {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public createTicket = async (buyTicketDto: BuyTicketDto, userId: number) => {
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
}

export default TicketsService;
