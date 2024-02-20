import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { isNil } from 'lodash';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  private get(key: string): string {
    
    const value = this.configService?.get(key);
    console.log(value);
    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
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
  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }
  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get isSyncronization(): boolean {
    return this.getBoolean('IS_SYNCRONIZATION');
  }
  get appConfig(): { port: number } {
    return {
      port: this.getNumber('SERVICE_PORT'),
    };
  }
}