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
import { AdminModule } from './admin/admin.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';

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
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'USER',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'STUDENT',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'PARENT',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'TEACHER',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'SUBJECT',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'GRADE',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'CLASSROOM',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'CLASS_STUDENT',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'GRADE_SUBJECT',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],

      name: 'EXAM',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'EXAM_SCORE',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'TIME_TABLE',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig(),
    }),

    AuthModule,
    UsersModule,
    AdminModule,
    StudentModule,
    TeacherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
