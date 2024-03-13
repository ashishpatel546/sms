import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Student } from 'src/entities/student.entity';
import { DataSource, ObjectLiteral } from 'typeorm';
import { NewStudentDto } from './dto/newStudent.dto';
import { UsersService } from 'src/users/users.service';
import { ResponseStatus, StatusOptions } from 'src/status';
import { Parent } from '../entities/parent.entity';
import { USER_ROLE, User } from 'src/entities/user.entity';
import { Classroom } from 'src/entities/classroom.entity';
import { NewClassDto } from './dto/newClass.dto';
import { Grade } from 'src/entities/grade.entity';
import { Subject } from 'src/entities/subject.entity';
import { Grade_Subject } from 'src/entities/grade_subject.entity';
import { Class_Student } from 'src/entities/class_student.entity';
import { NewExamDto } from './dto/newExam.dto';
import { Exam } from 'src/entities/exam.entity';
// import {v4 as uuidv4} from 'uuid';
const { v4: uuidv4 } = require('uuid');
const shortid = require('shortid');

@Injectable()
export class AdminService {
  constructor(
    @InjectDataSource('STUDENT') private readonly student: DataSource,
    @InjectDataSource('PARENT') private readonly parent: DataSource,
    @InjectDataSource('USER') private readonly user: DataSource,
    @InjectDataSource('CLASSROOM') private readonly classroom: DataSource,
    @InjectDataSource('CLASS_STUDENT')
    private readonly class_student: DataSource,
    @InjectDataSource('GRADE') private readonly grade: DataSource,
    @InjectDataSource('SUBJECT') private readonly subject: DataSource,
    @InjectDataSource('GRADE_SUBJECT')
    private readonly grade_subject: DataSource,
    @InjectDataSource('EXAM') private readonly exam: DataSource,
    @InjectDataSource('EXAM_SCORE') private readonly exam_score: DataSource,
    private readonly usersService: UsersService,
  ) {}

  async getStudent(): Promise<ResponseStatus<Student[]>> {
    try {
      const student = await this.student
        .getRepository(Student)
        .createQueryBuilder('student')
        .getMany();
      return {
        msg: StatusOptions.SUCCESS,
        description: 'All the students fetched',
        data: student,
      };
    } catch (error) {
      return {
        msg: StatusOptions.FAIL,
        description: error.message,
        data: null,
      };
    }
  }

  async getClass(): Promise<ResponseStatus<Object>> {
    try {
      const class_data = await this.grade_subject
        .createQueryBuilder()
        .select('g.grade_id', 'grade_id')
        .addSelect('g.grade', 'grade')
        .addSelect('ARRAY_AGG(DISTINCT c.section)', 'sections')
        .addSelect('ARRAY_AGG(DISTINCT s.subject_name)', 'subjects')
        .from('grade', 'g')
        .leftJoin('grade_subject', 'gs', 'g.grade_id = gs.grade_id')
        .leftJoin('subject', 's', 'gs.subject_id = s.subject_id')
        .leftJoin('classroom', 'c', 'g.grade = c.grade')
        .groupBy('g.grade_id, g.grade')
        .getRawMany();
      return {
        msg: StatusOptions.SUCCESS,
        description: 'All the casses fetched',
        data: class_data,
      };
    } catch (error) {
      return {
        msg: StatusOptions.FAIL,
        description: error.message,
        data: null,
      };
    }
  }

  async findGradeCode(currentClass): Promise<string> {
    const cls = currentClass.toLowerCase();
    const classMap: { [key: string]: string } = {
      first: '01',
      second: '02',
      third: '03',
      fourth: '04',
      fifth: '05',
      sixth: '06',
      seventh: '07',
      eighth: '08',
      ninth: '09',
      tenth: '10',
      eleventh: '11',
      twelfth: '12',
    };

    const class_code = classMap[cls];
    return class_code;
  }

  async generateStudentId(newStudent) {
    const school_code = '2024';
    const grade_code = await this.findGradeCode(newStudent.currentClass);
    const student = await this.student
      .createQueryBuilder(Student, 's')
      .orderBy('s.roll_number', 'DESC')
      .getOne();
    let student_roll;

    if (student) {
      const stu_roll = student.roll_number ?? 0;
      student_roll = stu_roll + 1;
    } else {
      student_roll = 0;
    }
    const roll_number = student_roll.toString().padStart(3, '0');
    const student_id = school_code + grade_code + roll_number;
    return student_id;
  }

  async setStudent(
    newStudent: NewStudentDto,
  ): Promise<ResponseStatus<Partial<Student>>> {
    const student_id = await this.generateStudentId(newStudent);
    const stu_email = newStudent.first_name + '_' + student_id + '@gmail.com';
    const password = newStudent.first_name + student_id;
    const parent_email =
      newStudent.first_name + '_' + student_id + '_parent@gmail.com';
    const hashedPassword = await this.usersService.hashPassword(password);

    const student: Partial<Student> = {
      student_id: student_id,
      created_on: new Date(),
      updated_on: new Date(),
      email: stu_email,
      first_name: newStudent.first_name ?? null,
      last_name: newStudent.last_name ?? null,
      gender: newStudent.gender,
      currentClass: newStudent.currentClass,
      classSec: newStudent.classSec,
      addressLine1: newStudent.addressLine1,
      addressLine2: newStudent.addressLine2 ?? null,
      dob: newStudent.dob,
      admissionID: newStudent.admissionID,
      admissionDate: newStudent.admissionDate,
      admissionSession: newStudent.admissionSession,
      prevSchool: newStudent.prevSchool ?? null,
      is_active: false,
      password: hashedPassword,
    };

    const parent: Partial<Parent> = {
      parent_student_id: student_id,
      created_on: new Date(),
      updated_on: new Date(),
      parent_email: parent_email,
      father_name: newStudent.father_name,
      father_email: newStudent.father_email ?? null,
      father_mobile: newStudent.father_mobile,
      father_occupation: newStudent.father_occupation ?? null,
      father_address: newStudent.father_address ?? null,
      mother_name: newStudent.mother_name,
      mother_email: newStudent.mother_email ?? null,
      mother_mobile: newStudent.mother_mobile,
      mother_occupation: newStudent.mother_occupation ?? null,
      mother_address: newStudent.mother_address ?? null,
      is_active: false,
      password: hashedPassword,
    };

    try {
      const classroom_id = await this.classroom
        .createQueryBuilder()
        .select('classroom_id')
        .from('classroom', 'c')
        .where('c.grade = :grade', { grade: student.currentClass })
        .andWhere('c.section = :section', { section: student.classSec })
        .getRawOne();

      if (!classroom_id) {
        throw new BadRequestException('No such class exists.');
      }

      await this.student
        .createQueryBuilder()
        .insert()
        .into(Student)
        .values(student)
        .execute();

      await this.parent
        .createQueryBuilder()
        .insert()
        .into(Parent)
        .values(parent)
        .execute();

      const class_stud = await this.class_student
        .createQueryBuilder()
        .insert()
        .into(Class_Student)
        .values([
          {
            classroom_id: classroom_id.classroom_id,
            student_id: student_id,
          },
        ])
        .execute();
      console.log('class_stud', class_stud);
      await this.user
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          {
            email: student.email,
            password: hashedPassword,
            is_active: student.is_active,
            role: USER_ROLE.student,
          },

          {
            email: parent.parent_email,
            password: hashedPassword,
            is_active: parent.is_active,
            role: USER_ROLE.parent,
          },
        ])
        .execute();

      return {
        msg: StatusOptions.SUCCESS,
        description: 'user added',
        data: student,
      };
    } catch (error) {
      return {
        msg: StatusOptions.FAIL,
        description: error.message,
        data: null,
      };
    }
  }

  async setClass(
    newClass: NewClassDto,
  ): Promise<ResponseStatus<Partial<Grade>>> {
    try {
      const new_grade: Partial<Grade> = {
        grade: newClass.grade,
        grade_id: shortid.generate(),
        description: newClass.description,
        created_on: new Date(),
        updated_on: new Date(),
      };

      const existingGrade = await this.grade
        .createQueryBuilder()
        .select('grade')
        .from('grade', 'g')
        .where('g.grade = :grade', { grade: newClass.grade })
        .getRawOne();

      if (!existingGrade) {
        await this.grade
          .createQueryBuilder()
          .insert()
          .into(Grade)
          .values(new_grade)
          .execute();
      }

      const len = newClass.sections.length;
      for (let i = 0; i < len; i++) {
        const new_class: Partial<Classroom> = {
          classroom_id: shortid.generate(),
          section: newClass.sections[i],
          grade: newClass.grade,
          created_on: new Date(),
          updated_on: new Date(),
        };

        const existingClass = await this.classroom
          .createQueryBuilder()
          .select('classroom_id')
          .from('classroom', 'c')
          .where('c.grade = :grade', { grade: new_class.grade })
          .andWhere('c.section = :section', { section: new_class.section })
          .getRawOne();

        if (!existingClass) {
          await this.classroom
            .createQueryBuilder()
            .insert()
            .into(Classroom)
            .values(new_class)
            .execute();
        }
      }
      const grade_id = await this.grade
        .createQueryBuilder()
        .select('grade_id')
        .from('grade', 'g')
        .where('g.grade = :grade', { grade: newClass.grade })
        .getRawOne();

      const leng = newClass.subjects.length;
      for (let i = 0; i < leng; i++) {
        const new_subject: Partial<Subject> = {
          subject_id: shortid.generate(),
          subject_name: newClass.subjects[i],
          created_on: new Date(),
          updated_on: new Date(),
        };

        const existingSubject = await this.subject
          .createQueryBuilder()
          .select('subject_name')
          .from('subject', 's')
          .where('s.subject_name = :subject', {
            subject: new_subject.subject_name,
          })
          .getRawOne();

        if (!existingSubject) {
          await this.subject
            .createQueryBuilder()
            .insert()
            .into(Subject)
            .values(new_subject)
            .execute();
        }

        const subject_id = await this.subject
          .createQueryBuilder()
          .select('subject_id')
          .from('subject', 'g')
          .where('g.subject_name = :subject', { subject: newClass.subjects[i] })
          .getRawOne();

        const grade_subject_id = await this.grade_subject
          .createQueryBuilder()
          .select('id')
          .from('grade_subject', 'g')
          .where('g.grade_id=:grade', { grade: grade_id.grade_id })
          .andWhere('g.subject_id=:subject', { subject: subject_id.subject_id })
          .getRawOne();

        if (!grade_subject_id) {
          await this.grade_subject
            .createQueryBuilder()
            .insert()
            .into('grade_subject')
            .values([
              {
                grade_id: grade_id.grade_id,
                subject_id: subject_id.subject_id,
              },
            ])
            .execute();
        }
      }
      return {
        msg: StatusOptions.SUCCESS,
        description: 'class added',
        data: new_grade,
      };
    } catch (error) {
      return {
        msg: StatusOptions.FAIL,
        description: error.message,
        data: null,
      };
    }
  }

  async setExam(newExam: NewExamDto): Promise<ResponseStatus<Partial<Exam>>> {
    try {
      let class_id = null;
      const grade_id = await this.grade
        .createQueryBuilder()
        .select('grade_id')
        .from('grade', 'g')
        .where('g.grade = :grade', { grade: newExam.grade })
        .getRawOne();

      if (!grade_id) {
        throw new BadRequestException('No such class exists');
      }

      if (newExam.section) {
        class_id = await this.classroom
          .createQueryBuilder()
          .select('classroom_id')
          .from('classroom', 'g')
          .where('g.grade = :grade', { grade: newExam.grade })
          .andWhere('g.section = :section', { section: newExam.section })
          .getRawOne();
      }

      const subject_id = await this.subject
        .createQueryBuilder()
        .select('subject_id')
        .from('subject', 's')
        .where('s.subject_name = :name', { name: newExam.subject })
        .getRawOne();
      if (!subject_id) {
        throw new BadRequestException('No such subject exists');
      }
      const grade_subject_id = await this.grade_subject
        .createQueryBuilder()
        .select('subject_id')
        .from('grade_subject', 's')
        .where('s.subject_id = :name', { name: subject_id.subject_id })
        .andWhere('s.grade_id= :grade', { grade: grade_id.grade_id })
        .getRawOne();
      if (!grade_subject_id) {
        throw new BadRequestException('No such subject exists for this class');
      }

      const new_exam = {
        exam_id: shortid.generate(),
        grade_id: grade_id.grade_id,
        class_id: class_id ? class_id.classroom_id : null,
        subject_id: subject_id.subject_id ?? null,
        exam_name: newExam.exam_name,
        exam_date: newExam.exam_date,
        start_time: newExam.start_time,
        duration: newExam.duration,
        syllabus: newExam.syllabus ?? null,
      };

      await this.exam
        .createQueryBuilder()
        .insert()
        .into(Exam)
        .values(new_exam)
        .execute();

      return {
        msg: StatusOptions.SUCCESS,
        description: 'exam added',
        data: new_exam,
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
