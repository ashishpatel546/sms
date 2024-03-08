import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/entities/student.entity';
import { UsersService } from 'src/users/users.service';
import { Parent } from '../entities/parent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student], 'STUDENT'),TypeOrmModule.forFeature([Parent], 'PARENT') ],
  providers: [AdminService,UsersService],
  controllers: [AdminController],
  exports: [AdminService]
})
export class AdminModule {}
