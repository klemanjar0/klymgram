import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { DublicateMessage, User, UserField } from '../../models/user';
import ErrorService, {
  ServiceError,
  UserError,
} from '../../utils/ErrorService/ErrorService';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsUserAlreadyExist } from '../../decorators/user/isUserExists';
import * as bcrypt from 'bcryptjs';
import JwtService from '../../utils/JWTService/JWTService';
import { TokenType } from '../../utils/JWTService/entities';

export interface UserCreatePayload {
  [UserField.email]: string;
  [UserField.username]: string;
  [UserField.password]: string;
}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export class UserSchema implements UserCreatePayload {
  @IsString()
  @IsEmail()
  @MinLength(4)
  @IsUserAlreadyExist({
    message: DublicateMessage,
  })
  [UserField.email]: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @IsUserAlreadyExist({
    message: DublicateMessage,
  })
  [UserField.username]: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  [UserField.password]: string;
}

@Controller('authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() body: UserSchema): Promise<User> {
    try {
      return await this.authService.create(body);
    } catch (e) {
      ErrorService.throwError(ServiceError.DATABASE_ERROR);
    }
  }

  @Post('login')
  async login(@Body() body: LoginPayload): Promise<LoginResponse> {
    const user = await this.authService.getByMetadata(body.login);

    if (!user) ErrorService.throwError(UserError.USER_NOT_FOUND);

    const pwdPassed = await bcrypt.compare(
      body.password,
      user[UserField.password],
    );

    if (!pwdPassed) ErrorService.throwError(UserError.INCORRECT_PASSWORD);

    const accessToken = await JwtService.getJwt(
      {
        id: user.id,
      },
      TokenType.access,
    );

    const refreshToken = await JwtService.getJwt(
      {
        id: user.id,
      },
      TokenType.refresh,
    );

    await this.authService.setRefreshToken({ user, token: refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('update_refresh')
  async updateTokens(@Body() body: { token: string }): Promise<LoginResponse> {
    try {
      const refreshTokenData = await JwtService.decodeJwt(
        body.token,
        TokenType.refresh,
      );

      const accessToken = await JwtService.getJwt(
        {
          id: refreshTokenData.id,
        },
        TokenType.access,
      );

      const refreshToken = await JwtService.getJwt(
        {
          id: refreshTokenData.id,
        },
        TokenType.refresh,
      );

      const user = await this.authService.getById(refreshTokenData.id);
      await this.authService.setRefreshToken({ user, token: refreshToken });

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      if (e.message === 'jwt expired') {
        ErrorService.throwError(UserError.EXPIRED_TOKEN);
      } else {
        ErrorService.throwError(ServiceError.DATABASE_ERROR);
      }
    }
  }
}
