import { PrismaClient } from "@prisma/client";
import HttpException from "../exceptions/HttpException";

class TicketsService {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public createTicket = async () => {};
}

export default TicketsService;
