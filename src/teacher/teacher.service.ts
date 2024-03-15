import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ResponseStatus, StatusOptions } from 'src/status';
import { Teacher } from 'src/entities/teacher.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectDataSource('TEACHER') private readonly teacher: DataSource,
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
}
