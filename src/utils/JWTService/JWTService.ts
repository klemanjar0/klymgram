import * as randomString from 'randomstring';
import * as jsonwebtoken from 'jsonwebtoken';
import { VerifyErrors } from 'jsonwebtoken';
import { IClientData, IOptions, TokenType } from './entities';
import { config as initialize_env } from 'dotenv';

initialize_env();

export class JwtService {
  private readonly access_secret: string;
  private readonly refresh_secret: string;
  private readonly access_options: IOptions;
  private readonly refresh_options: IOptions;

  constructor() {
    this.access_secret =
      process.env.JWT_ACCESS_SECRET || randomString.generate(100);
    this.refresh_secret =
      process.env.JWT_REFRESH_SECRET || randomString.generate(100);
    this.access_options = {
      expiresIn: process.env.JWT_ACCESS_MAX_AGE || '15m',
    };
    this.refresh_options = {
      expiresIn: process.env.JWT_REFRESH_MAX_AGE || '12h',
    };
  }

  public getJwt(data: IClientData, tokenType: TokenType): Promise<string> {
    const secret =
      tokenType === TokenType.refresh
        ? this.refresh_secret
        : this.access_secret;

    const options =
      tokenType === TokenType.refresh
        ? this.refresh_options
        : this.access_options;

    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(data, secret, options, (err, token) => {
        err ? reject(err) : resolve(token || '');
      });
    });
  }

  public decodeJwt(jwt: string, tokenType: TokenType): Promise<IClientData> {
    const secret =
      tokenType === TokenType.refresh
        ? this.refresh_secret
        : this.access_secret;

    return new Promise((res, rej) => {
      jsonwebtoken.verify(
        jwt,
        secret,
        (err: VerifyErrors | null, decoded?: object) => {
          return err ? rej(err) : res(decoded as IClientData);
        },
      );
    });
  }
}

export default new JwtService();
