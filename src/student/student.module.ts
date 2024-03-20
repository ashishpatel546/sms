import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { ParentsService } from 'src/parents/parents.service';

@Module({
  providers: [StudentService,ParentsService],
  controllers: [StudentController]
})
export class StudentModule {}
