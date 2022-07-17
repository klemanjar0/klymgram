import { HttpException, HttpStatus } from '@nestjs/common';

export enum ServiceError {
  DATABASE_ERROR = 'DATABASE_ERROR',
}

export enum UserError {
  USER_EXISTS = 'USER_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  UNAUTHORIZED = 'UNAUTHORIZED',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
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
    [UserError.USER_NOT_FOUND]: {
      errorCode: HttpStatus.NOT_FOUND,
      error: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User with provided email or username is not found.',
      },
    },
    [UserError.INCORRECT_PASSWORD]: {
      errorCode: HttpStatus.NOT_ACCEPTABLE,
      error: {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Password is incorrect.',
      },
    },
    [UserError.UNAUTHORIZED]: {
      errorCode: HttpStatus.UNAUTHORIZED,
      error: {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized.',
      },
    },
    [UserError.EXPIRED_TOKEN]: {
      errorCode: HttpStatus.UNAUTHORIZED,
      error: {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Token expired.',
      },
    },
  };

  throwError(errorSignature: CustomError, customBody?: Record<string, any>) {
    const error = this.errors[errorSignature];
    throw new HttpException({ ...error.error, ...customBody }, error.errorCode);
  }
}

export default new ErrorService();
