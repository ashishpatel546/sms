import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { Teacher } from 'src/entities/teacher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/entities/attendance.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Teacher], 'TEACHER'),
  TypeOrmModule.forFeature([Attendance], 'ATTENDANCE')],
  controllers: [TeacherController],
  providers: [TeacherService]
})
export class TeacherModule {}
