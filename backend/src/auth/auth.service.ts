import { PrismaClient, User } from "@prisma/client";
import { LoginUserDto, RegisterUserDto } from "./auth.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt";
import UsersService from "../users/users.service";
import HttpException from "../exceptions/HttpException";

class AuthService {
  private readonly prisma: PrismaClient;
  private readonly usersService: UsersService;

  constructor(prisma: PrismaClient, usersService: UsersService) {
    this.prisma = prisma;
    this.usersService = usersService;
  }

  public registerUser = async (registerData: RegisterUserDto) => {
    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    const createdUser = await this.prisma.user.create({
      data: {
        ...registerData,
        password: hashedPassword,
      },
    });

    if (!createdUser) {
      throw new HttpException(500, "Error while creating user.");
    }

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

  public createCookie(token: string) {
    return `Authorization=${token}; HttpOnly; Max-Age=${jwtConfig.expiresIn}`;
  }
}

export default AuthService;
