import App from "./app";
import AuthController from "./auth/auth.controller";

const app = new App([new AuthController()]);
app.appListen();
