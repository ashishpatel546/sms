import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from 'src/env-validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfig } from 'src/config/dbconfig';
import { SharedModule } from './config/shared.module';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false,
      validate,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports : [SharedModule],
      inject: [DbConfig],
      name: 'USER',
      useFactory: (configService: DbConfig) =>
      configService.getPostGresConfig(),
    }),
    AuthModule,
    UsersModule 
   
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
