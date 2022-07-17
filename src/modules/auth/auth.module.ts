import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/user';
import { IsUserAlreadyExistConstraint } from '../../decorators/user/isUserExists';
import { RefreshToken } from '../../models/refreshToken';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  controllers: [AuthController],
  providers: [AuthService, IsUserAlreadyExistConstraint],
  exports: [TypeOrmModule, AuthService, IsUserAlreadyExistConstraint],
})
export class AuthModule {}
