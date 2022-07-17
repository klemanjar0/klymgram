import {
  Body,
  Controller,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { DublicateMessage, User, UserField } from '../../models/user';
import ErrorService, {
  ServiceError,
} from '../../utils/ErrorService/ErrorService';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsUserAlreadyExist } from '../../decorators/user/isUserExists';

export interface UserCreatePayload {
  [UserField.email]: string;
  [UserField.username]: string;
  [UserField.password]: string;
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
      console.log(e);
      ErrorService.throwError(ServiceError.DATABASE_ERROR);
    }
  }
}
