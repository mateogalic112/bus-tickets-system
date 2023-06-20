import { PrismaClient, User } from "@prisma/client";
import { RegisterUserDto } from "./auth.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt";

class AuthService {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public registerUser = async (registerData: RegisterUserDto) => {
    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    const createdUser = await this.prisma.user.create({
      data: {
        ...registerData,
        password: hashedPassword,
      },
    });
    return createdUser;
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
