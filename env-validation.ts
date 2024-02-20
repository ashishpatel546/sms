import {plainToClass} from 'class-transformer';
import {
  IsEnum,
  IsPort,
  IsString,
  IsNotEmpty,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsNotEmpty()
  NODE_ENV: Environment;

  @IsPort()
  @IsNotEmpty()
  SERVICE_PORT: string;

  @IsString()
  @IsNotEmpty()
  DB_HOST_REDSHIFT: string;
  @IsPort()
  @IsNotEmpty()
  DB_PORT_REDSHIFT: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME_REDSHIFT: string;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME_REDSHIFT: string;

  @IsNotEmpty()
  DB_PASSWORD_REDSHIFT: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRY: string;
}

export function validate(config: Record<string,unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  return validatedConfig;
}