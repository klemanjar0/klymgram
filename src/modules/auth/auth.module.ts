import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/user';
import { IsUserAlreadyExistConstraint } from '../../decorators/user/isUserExists';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, IsUserAlreadyExistConstraint],
  exports: [TypeOrmModule, AuthService, IsUserAlreadyExistConstraint],
})
export class AuthModule {}
