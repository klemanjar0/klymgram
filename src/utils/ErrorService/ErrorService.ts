import { HttpException, HttpStatus } from '@nestjs/common';

export enum ServiceError {
  DATABASE_ERROR = 'DATABASE_ERROR',
}

export enum UserError {
  USER_EXISTS = 'USER_EXISTS',
}

export enum ValidationError {
  EMAIL_IS_NOT_VALID = 'EMAIL_IS_NOT_VALID',
}

export type CustomError = ServiceError | ValidationError | UserError;

export type TypedError = Record<
  CustomError,
  {
    errorCode: HttpStatus;
    error: {
      message: string | string[];
      statusCode: HttpStatus;
    } & {
      [key in string]?: any;
    };
  }
>;

class ErrorService {
  errors: TypedError = {
    [ServiceError.DATABASE_ERROR]: {
      errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Database error.',
      },
    },
    [ValidationError.EMAIL_IS_NOT_VALID]: {
      errorCode: HttpStatus.BAD_REQUEST,
      error: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You have provided email, that is not valid.',
      },
    },
    [UserError.USER_EXISTS]: {
      errorCode: HttpStatus.BAD_REQUEST,
      error: {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'User with provided email or username already exists. Choose another one.',
      },
    },
  };

  throwError(errorSignature: CustomError, customBody?: Record<string, any>) {
    const error = this.errors[errorSignature];
    throw new HttpException({ ...error.error, ...customBody }, error.errorCode);
  }
}

export default new ErrorService();
