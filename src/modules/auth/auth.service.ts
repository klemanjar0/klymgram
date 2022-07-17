import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User, UserField } from '../../models/user';
import { forIn } from 'lodash';
import { UserSchema } from './auth.controller';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async isUserExists(value: string) {
    const entity = await this.usersRepository.findOneBy([
      { [UserField.email]: value },
      { [UserField.username]: value },
    ]);
    return !!entity;
  }

  async create(user: UserSchema) {
    const entity = await new User();
    forIn(user, (value, key) => {
      entity[key] = value;
    });
    return await this.usersRepository.save(entity);
  }
}
