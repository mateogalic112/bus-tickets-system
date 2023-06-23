import App from "./app";
import AuthController from "./auth/auth.controller";
import AuthService from "./auth/auth.service";
import RoutesController from "./routes/routes.controller";
import RoutesService from "./routes/routes.service";
import PrismaService from "./services/prismaService";
import TicketsController from "./tickets/tickets.controller";
import TicketsService from "./tickets/tickets.service";
import UsersController from "./users/users.controller";
import UsersService from "./users/users.service";

const app = new App([
  new AuthController(
    new AuthService(
      PrismaService.getPrisma(),
      new UsersService(PrismaService.getPrisma())
    )
  ),
  new RoutesController(new RoutesService(PrismaService.getPrisma())),
  new TicketsController(
    new TicketsService(
      PrismaService.getPrisma(),
      new RoutesService(PrismaService.getPrisma())
    )
  ),
  new UsersController(new UsersService(PrismaService.getPrisma())),
]);
app.appListen();
