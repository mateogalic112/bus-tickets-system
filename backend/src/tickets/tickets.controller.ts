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
import { User } from "@prisma/client";

class TicketsController {
  readonly path = "/tickets";
  readonly router = Router();
  private readonly ticketsService: TicketsService;

  constructor(ticketsService: TicketsService) {
    this.ticketsService = ticketsService;
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(buyTicketSchema),
      this.buyTicket
    );
  }

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
}

export default TicketsController;
