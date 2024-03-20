import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Student } from 'src/entities/student.entity';
import { ResponseStatus, StatusOptions } from 'src/status';
import { DataSource } from 'typeorm';

@Injectable()
export class StudentService {
    constructor(@InjectDataSource('STUDENT') private readonly student:DataSource,
    @InjectDataSource('PARENT') private readonly parent:DataSource){}


    async getProfile(student_id: string): Promise<ResponseStatus<Partial<Student>>>{
        try {
            console.log('student_id', student_id);

          
            const result = await this.student
            .createQueryBuilder('student','s')
            .leftJoinAndSelect('parent', 'p', 'p.parent_student_id = s.student_id')
            .select([
                'student_id',
                'first_name',
                'last_name',
                'email',
                'currentClass',
                'classSec',
                'gender',
                'dob',
                'admissionID',
                'admissionDate',
                'admissionSession',
                'prevSchool',
                'father_name',
                'father_mobile',
                'father_occupation',
                'mother_name',
                'mother_mobile',
                'mother_occupation',
              ])
            .where('s.student_id = :id', { id: student_id })
            .getRawOne();
           
      
              console.log('student', result)
              return {
                msg: StatusOptions.SUCCESS,
                description: "Student's Profile",
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
