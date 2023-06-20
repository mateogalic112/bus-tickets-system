import App from "./app";
import AuthController from "./auth/auth.controller";
import AuthService from "./auth/auth.service";
import RoutesController from "./routes/routes.controller";
import RoutesService from "./routes/routes.service";
import PrismaService from "./services/prismaService";
import UsersService from "./users/users.service";

const app = new App([
  new AuthController(
    new AuthService(
      PrismaService.getPrisma(),
      new UsersService(PrismaService.getPrisma())
    )
  ),
  new RoutesController(new RoutesService(PrismaService.getPrisma())),
]);
app.appListen();
