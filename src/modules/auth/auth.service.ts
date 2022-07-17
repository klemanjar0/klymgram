import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User, UserField } from '../../models/user';
import { forIn } from 'lodash';
import { UserSchema } from './auth.controller';
import { RefreshToken, RefreshTokenField } from '../../models/refreshToken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async isUserExists(value: string): Promise<boolean> {
    const entity = await this.usersRepository.findOneBy([
      { [UserField.email]: value },
      { [UserField.username]: value },
    ]);
    return !!entity;
  }

  async create(user: UserSchema): Promise<User> {
    const entity = await new User();
    forIn(user, (value, key) => {
      entity[key] = value;
    });
    return await this.usersRepository.save(entity);
  }

  async getByMetadata(value: string): Promise<User> {
    return await this.usersRepository.findOneBy([
      { [UserField.email]: value },
      { [UserField.username]: value },
    ]);
  }

  async getById(value: number): Promise<User> {
    return await this.usersRepository.findOneBy({ [UserField.id]: value });
  }

  async setRefreshToken(data: { user: User; token: string }) {
    const user = await this.usersRepository.findOneBy({
      [UserField.id]: data.user[UserField.id],
    });

    user[UserField.refreshToken] = new RefreshToken();
    user[UserField.refreshToken][RefreshTokenField.refreshToken] = data.token;

    await this.usersRepository.save(user);
  }
}
