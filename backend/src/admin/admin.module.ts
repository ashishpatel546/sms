import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/entities/student.entity';
import { UsersService } from 'src/users/users.service';
import { Parent } from '../entities/parent.entity';
import { Classroom } from 'src/entities/classroom.entity';
import { Class_Student } from 'src/entities/class_student.entity';
import { Grade } from 'src/entities/grade.entity';
import { Subject } from 'src/entities/subject.entity';
import { Grade_Subject } from 'src/entities/grade_subject.entity';
import { Exam } from 'src/entities/exam.entity';
import { Exam_Score } from 'src/entities/exam_score.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { Time_table } from 'src/entities/timetable.entity';
import { Grade_Fees } from 'src/entities/grade_fees.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student], 'STUDENT'),
    TypeOrmModule.forFeature([Parent], 'PARENT'),
    TypeOrmModule.forFeature([Classroom], 'CLASSROOM'),
    TypeOrmModule.forFeature([Class_Student], 'CLASS_STUDENT'),
    TypeOrmModule.forFeature([Grade], 'GRADE'),
    TypeOrmModule.forFeature([Subject], 'SUBJECT'),
    TypeOrmModule.forFeature([Grade_Subject], 'GRADE_SUBJECT'),
    TypeOrmModule.forFeature([Exam], 'EXAM'),
    TypeOrmModule.forFeature([Exam_Score], 'EXAM_SCORE'),
    TypeOrmModule.forFeature([Teacher], 'TEACHER'),
    TypeOrmModule.forFeature([Time_table], 'TIME_TABLE'),
    TypeOrmModule.forFeature([Grade_Fees], 'GRADE_FEES'),
  ],
  providers: [AdminService, UsersService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
