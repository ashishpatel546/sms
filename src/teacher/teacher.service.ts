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
          't.first_name',
          't.last_name',
          't.teacher_id',
          't.join_on',
          't.email',
          't.dob',
          't.classTeacher',
          't.mobile',
          't.speciality',
          't.qualification',
          't.class_id',
          't.salary',
          't.experience',
          't.gender',
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
              't.day',
              't.class',
              't.section',
              't.period',
              't.subjects'
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
           // return timetable
          
          
          
        


   
}
