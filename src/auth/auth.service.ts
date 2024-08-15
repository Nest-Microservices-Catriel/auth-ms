import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { envs } from 'src/config/envs';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Auth service');
  onModuleInit() {
    this.$connect();
    this.logger.log('MongoDB connected');
  }
  constructor(private jwtService: JwtService) {
    super();
  }

  async signJWT(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload);
  }

  async register(registerUserDto: RegisterUserDto) {
    console.log(registerUserDto);

    const { email, name, password } = registerUserDto;
    try {
      const user = await this.user.findUnique({
        where: {
          email: email,
        },
      });

      if (user)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Email already registered',
        });
      const newUser = await this.user.create({
        data: {
          name,
          email,
          password: bcrypt.hashSync(password, 10),
        },
      });
      const { password: __, ...rest } = newUser;
      return { user: rest, token: await this.signJWT(rest) };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const userFound = await this.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!userFound)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid credentials',
      });

    const isValid = bcrypt.compareSync(password, userFound.password);

    if (!isValid)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid credentials',
      });
    const { password: __, ...rest } = userFound;
    return { user: rest, token: await this.signJWT(rest) };
  }
  async checkToken(token: string) {
    try {
      const { iat, exp, ...user } = this.jwtService.verify<{
        id: string;
        email: string;
        name: string;
        iat: number;
        exp: number;
      }>(token, {
        secret: envs.secretJwt,
      });

      return {
        user,
        token: await this.signJWT(user),
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({ status: HttpStatus.UNAUTHORIZED });
    }
    return 'token';
  }
}
