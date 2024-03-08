import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Student } from 'src/entities/student.entity';
import { ResponseStatus, StatusOptions } from 'src/status';
import { DataSource, createQueryBuilder } from 'typeorm';

@Injectable()
export class StudentService {
    constructor(@InjectDataSource('STUDENT') private readonly student:DataSource,
    @InjectDataSource('PARENT') private readonly parent:DataSource){}


    async getProfile(student_id: string): Promise<ResponseStatus<Partial<Student>>>{
        try {
            console.log('student_id', student_id);

            // const student = await this.student
            //   .createQueryBuilder()
            //    .select()
            //   .from('student', 's')
            //   .where('s.student_id = :id',{id: student_id})
            //   .getRawOne();

            //   const parent = await this.parent
            //   .createQueryBuilder()
            //    .select()
            //   .from('parent', 'p')
            //   .where('p.parent_student_id = :id',{id: student_id})
            //   .getRawOne();
            const result = await this.student
            .createQueryBuilder('student','s')
            .leftJoinAndSelect('parent', 'p', 'p.parent_student_id = s.student_id')
            .select([
                's.student_id',
                's.first_name',
                's.last_name',
                's.email',
                's.currentClass',
                's.classSec',
                's.gender',
                's.dob',
                's.admissionID',
                's.admissionDate',
                's.admissionSession',
                's.prevSchool',
                
            

                'p.father_name',
                'p.father_mobile',
                'p.father_occupation',
                'p.mother_name',
                'p.mother_mobile',
                'p.mother_occupation',
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
