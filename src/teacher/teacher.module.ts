import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { Teacher } from 'src/entities/teacher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Teacher], 'TEACHER')],
  controllers: [TeacherController],
  providers: [TeacherService]
})
export class TeacherModule {}
