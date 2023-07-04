import App from "./app";
import AuthController from "./auth/auth.controller";
import AuthService from "./auth/auth.service";
import RoutesController from "./routes/routes.controller";
import RoutesRepository from "./routes/routes.repository";
import RoutesService from "./routes/routes.service";
import PrismaService from "./services/prismaService";
import TicketsController from "./tickets/tickets.controller";
import TicketsRepository from "./tickets/tickets.repository";
import TicketsService from "./tickets/tickets.service";
import UsersController from "./users/users.controller";
import UsersService from "./users/users.service";

const app = new App([
  new AuthController(
    new AuthService(new UsersService(PrismaService.getPrisma()))
  ),
  new RoutesController(
    new RoutesService(new RoutesRepository(PrismaService.getPrisma()))
  ),
  new TicketsController(
    new TicketsService(
      new TicketsRepository(PrismaService.getPrisma()),
      new RoutesRepository(PrismaService.getPrisma())
    )
  ),
  new UsersController(new UsersService(PrismaService.getPrisma())),
]);
app.appListen();
