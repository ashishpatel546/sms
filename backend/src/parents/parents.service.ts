import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Exam_Score } from 'src/entities/exam_score.entity';
import { Parent } from 'src/entities/parent.entity';
import { Student } from 'src/entities/student.entity';
import { ResponseStatus, StatusOptions } from 'src/status';
import { DataSource,  } from 'typeorm';

@Injectable()
export class ParentsService {
    constructor(
    @InjectDataSource('PARENT') private readonly parent: DataSource,
    @InjectDataSource('STUDENT') private readonly student: DataSource,
    @InjectDataSource('EXAM_SCORE') private readonly exam_score: DataSource,
    ){}
    async getProfile(
        parent_id: string,
      ): Promise<ResponseStatus<Partial<Parent>>> {
        
            try {
                const result = await this.parent
                    .createQueryBuilder()
                    .select([
                        'email',
                        'father_email',
                        'father_name',
                        'mother_name',
                        'father_mobile',
                        'mother_email',
                        'mother_mobile',
                        'father_address',
                        'first_name',
                        'last_name',
                        'current_class',
                        'class_sec',
                        'dob',
                        'admission_id',
                        'admission_date',
                        'admission_session'
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


async getExamResults(parentId: string): Promise<ResponseStatus<any[]>> {
    try {
        // Fetch exam results for the given parent ID, joined with exams and subjects
        const examResults = await this.exam_score
            .createQueryBuilder()
            .select([
                'obtained_marks',
                'maximum_marks',
                'obtained_grade',
                'exam.exam_name',
                'subject.subject_name',
            ])
            .from('exam_score','e')
            .leftJoin('exam', 'exam', 'exam.exam_id = e.exam_id')
            .leftJoin('subject', 'subject', 'subject.subject_id = exam.subject_id')
            .where('e.student_id = :studentId', { studentId: parentId })
            .orderBy('e.exam_id')
            .getRawMany();

        // Group exam results by exam name
        const groupedResults = examResults.reduce((acc, curr) => {
            const { exam_id, exam_name, ...rest } = curr;
            if (!acc[exam_id]) {
                acc[exam_id] = { exam_id, exam_name, subjects: [] };
            }
            acc[exam_id].subjects.push(rest);
            return acc;
        }, {});

        // Convert object to array and return the formatted exam results
        const formattedResults = Object.values(groupedResults);

        return {
            msg: StatusOptions.SUCCESS,
            description: 'Exam results fetched successfully',
            data: formattedResults,
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
