import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User, UserField } from '../../models/user';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserSchema } from '../../modules/auth/auth.controller';
import { AuthService } from '../../modules/auth/auth.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly authService: AuthService) {}

  async validate(value: any, args: ValidationArguments) {
    return !(await this.authService.isUserExists(value));
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: UserSchema, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
