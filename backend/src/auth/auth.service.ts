import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt";
import UsersService from "../users/users.service";
import HttpException from "../exceptions/HttpException";
import { LoginUserDto, RegisterUserDto } from "./auth.validation";

class AuthService {
  private readonly usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  public registerUser = async (registerData: RegisterUserDto) => {
    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    const createdUser = await this.usersService.createUser({
      ...registerData,
      password: hashedPassword,
    });

    return createdUser;
  };

  public loginUser = async (loginData: LoginUserDto) => {
    const foundUser = await this.usersService.getUserByEmail(loginData.email);

    const isPasswordMatching = await bcrypt.compare(
      loginData.password,
      foundUser.password
    );

    if (!isPasswordMatching) {
      throw new HttpException(400, "Wrong credentials.");
    }

    return foundUser;
  };

  public createToken(user: User) {
    return jwt.sign({ userId: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  }
}

export default AuthService;
