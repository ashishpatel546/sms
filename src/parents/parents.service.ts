import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Parent } from 'src/entities/parent.entity';
import { Student } from 'src/entities/student.entity';
import { ResponseStatus, StatusOptions } from 'src/status';
import { DataSource,  } from 'typeorm';

@Injectable()
export class ParentsService {
    constructor(
    @InjectDataSource('PARENT') private readonly parent: DataSource,
    @InjectDataSource('STUDENT') private readonly student: DataSource
    ){}
    async getProfile(
        parent_id: string,
      ): Promise<ResponseStatus<Partial<Parent>>> {
        
            try {
                const result = await this.parent
                    .createQueryBuilder()
                    .select([
                        'p.email',
                        'p.father_email',
                        'p.father_name',
                        'p.mother_name',
                        'p.father_mobile',
                        'p.mother_email',
                        'p.mother_mobile',
                        'p.father_address',
                        's.first_name',
                        's.last_name',
                        's.current_class',
                        's.class_sec',
                        's.dob',
                        's.admission_id',
                        's.admission_date',
                        's.admission_session'
                    ])
                    
                    .from('parent', 'p')
                    .innerJoin('student', 's', 'p.parent_student_id = s.student_id')
                    .where('p.parent_student_id = :id', { id: parent_id })
                    .getRawOne();
                
    
                if (!result) {
                    throw new Error('Parent not found');
                }
    
                return {
                    msg: StatusOptions.SUCCESS,
                    description: "Parent's Profile",
                    data: result
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
