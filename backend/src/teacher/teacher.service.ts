import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ResponseStatus, StatusOptions } from 'src/status';
import { Teacher } from 'src/entities/teacher.entity';

import { Time_table } from 'src/entities/timetable.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectDataSource('TEACHER') private readonly teacher: DataSource,
    @InjectDataSource('TIME_TABLE') private readonly Time_table: DataSource,
  ) {}
  async getProfile(
    teacher_id: string,
  ): Promise<ResponseStatus<Partial<Teacher>>> {
    try {
      const result = await this.teacher
        .createQueryBuilder()
        .select([
          'first_name',
          'last_name',
          'teacher_id',
          'join_on',
          'email',
          'dob',
          'classTeacher',
          'mobile',
          'speciality',
          'qualification',
          'class_id',
          'salary',
          'experience',
          'gender',
        ])
        .from('teacher', 't')
        .where('t.teacher_id = :id', { id: teacher_id })
        .getRawOne();
      return {
        msg: StatusOptions.SUCCESS,
        description: "Teacher's Profile",
        data: result,
      };
    } catch (error) {
      return {
        msg: StatusOptions.FAIL,
        description: error.message,
        data: null,
      };
    }
  }
   async getTimetableForTeacher(teacher_id:string):Promise<ResponseStatus<Partial<Time_table[]>>>{
   
   try{ const timetable = await this.Time_table
            .createQueryBuilder()
            .select([
              'day',
              'class',
              'section',
              'period',
              'subjects'
            ])
            .from('Time_table', 't')
            .where('t.teacher_id = :teacher_id', { teacher_id: teacher_id })
            
            .getRawMany();
            console.log('timetable', timetable)
            return {
              msg: StatusOptions.SUCCESS,
              description: "Teacher's time-table",
              data: timetable,
            };
          } catch (error) {
            return {
              msg: StatusOptions.FAIL,
              description: error.message,
              data: null,
            };
          }
        }
           
          
          
          
        


   
}
