import {
  type Request,
  type Response,
  type NextFunction,
  Router,
} from "express";
import validationMiddleware from "../middleware/validationMiddleware";
import TicketsService from "./tickets.service";
import { BuyTicketDto, buyTicketSchema } from "./tickets.validation";
import authMiddleware from "../middleware/authMiddleware";
import { Prisma, User } from "@prisma/client";

class TicketsController {
  readonly path = "/tickets";
  readonly router = Router();
  private readonly ticketsService: TicketsService;

  constructor(ticketsService: TicketsService) {
    this.ticketsService = ticketsService;
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}/me`, authMiddleware, this.getUserTickets);

    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(buyTicketSchema),
      this.buyTicket
    );

    this.router.patch(
      `${this.path}/:ticketId/cancel`,
      authMiddleware,
      this.cancelTicket
    );
  }

  private getUserTickets = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const user = request.user as User;

    const params = request.query as unknown as {
      cursor: Prisma.TicketWhereUniqueInput | undefined;
    };
    try {
      const userTickets = await this.ticketsService.getUserTickets(
        user.id,
        params.cursor
      );
      return response.json(userTickets);
    } catch (err) {
      next(err);
    }
  };

  private buyTicket = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const buyTicketData: BuyTicketDto = request.body;
    const user = request.user as User;
    try {
      const createdTicket = await this.ticketsService.createTicket(
        buyTicketData,
        user.id
      );
      return response.json(createdTicket);
    } catch (err) {
      next(err);
    }
  };

  private cancelTicket = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const user = request.user as User;
    const ticketId = parseInt(request.params.ticketId, 10);

    try {
      const canceledTicket = await this.ticketsService.cancelTicket(
        user.id,
        ticketId
      );
      return response.json(canceledTicket);
    } catch (err) {
      next(err);
    }
  };
}

export default TicketsController;
