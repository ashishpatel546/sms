import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }
    return value;
  }

  private getString(key: string): string {
    return this.get(key).trim();
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return parseInt(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  get getJwtConfig() {
    return this.getString('JWT_SECRET');
  }

  createJwtOptions(): JwtModuleOptions {
    return {
      global: true,
      secret: this.getString('JWT_SECRET'),
      signOptions: {
        expiresIn: this.getString('JWT_EXPIRY'),
      },
    };
  }
}