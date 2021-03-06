export enum TokenType {
  refresh = 'refresh',
  access = 'access',
}

export interface IClientData {
  id: number;
  iat?: number;
  exp?: number;
}

export interface IOptions {
  expiresIn: string;
}
