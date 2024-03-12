import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Student } from 'src/entities/student.entity';
import { DataSource } from 'typeorm';
import { NewStudentDto } from './dto/newStudent.dto';
import { UsersService } from 'src/users/users.service';
import { ResponseStatus, StatusOptions } from 'src/status';
import { Parent } from '../entities/parent.entity';
import { USER_ROLE, User } from 'src/entities/user.entity';
import { NewTeacherDto } from './dto/newTeacher.dto';
import { Teacher } from 'src/entities/teacher.entity';
// import {v4 as uuidv4} from 'uuid';
const { v4: uuidv4 } = require('uuid');
const shortid = require('shortid');

@Injectable()
export class AdminService {
  constructor(
    @InjectDataSource('STUDENT') private readonly student: DataSource,
    @InjectDataSource('PARENT') private readonly parent: DataSource,
    @InjectDataSource('USER') private readonly user: DataSource,
    @InjectDataSource('TEACHER') private readonly teacher: DataSource,
    private readonly usersService: UsersService,
  ) {}

  async getStudent(): Promise<Student[]>{
    try {
      // const student = await this.student
      //   .createQueryBuilder()
      //   .select()
      //   .from('student', 's')
      //   .getMany();

      const student = await this.student
      .getRepository(Student)
        .createQueryBuilder("student")
        .getMany();
      return student;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async setStudent(newStudent: NewStudentDto):Promise<ResponseStatus<Partial<Student>>> {
    const stu_id = shortid.generate(); 
    //console.log(stu_id); 
    const password = newStudent.first_name + newStudent.admissionID;
    const stu_email = stu_id + '_' + newStudent.first_name + '@gmail.com';
    const parent_email = stu_id + '_' + newStudent.first_name + '_parent@gmail.com';
      const hashedPassword = await this.usersService.hashPassword(password);
      const student: Partial<Student> = {
        student_id: stu_id,
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
        parent_student_id: stu_id,
        created_on: new Date(),
        updated_on: new Date(),
        parent_email: parent_email,
        father_name: newStudent.father_name,
        father_email:newStudent.father_email ?? null,
        father_mobile: newStudent.father_mobile,
        father_occupation: newStudent.father_occupation ?? null,
        father_address: newStudent.father_address ?? null,
        mother_name: newStudent.mother_name,
        mother_email:newStudent.mother_email ?? null,
        mother_mobile: newStudent.mother_mobile,
        mother_occupation: newStudent.mother_occupation ?? null,
        mother_address: newStudent.mother_address ?? null, 
        is_active: false,
        password: hashedPassword,
      }

      try {
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

          await this.user
          .createQueryBuilder()
          .insert()
          .into(User)
          .values([
            {email: student.email, password: hashedPassword, is_active: student.is_active, role: USER_ROLE.student},
            {email: parent.parent_email, password: hashedPassword, is_active: parent.is_active, role: USER_ROLE.parent}
          ])
          .execute();

        return {
          msg: StatusOptions.SUCCESS,
          description: 'user added',
          data: student
        };
      } catch (error) {
        return {
          msg: StatusOptions.FAIL,
          description: error.message,
          data: null,
        };
      }
    }
    
    async setTeacher(newTeacher: NewTeacherDto):Promise<ResponseStatus<Partial<Teacher>>> {
      const staff_id = shortid.generate(); 
      //console.log(stu_id); 
      const password = newTeacher.first_name + staff_id;
      const staff_email = staff_id + '_' + newTeacher.first_name + '@gmail.com';
     // const parent_email = stu_id + '_' + newStudent.first_name + '_parent@gmail.com';
        const hashedPassword = await this.usersService.hashPassword(password);
        const teacher: Partial<Teacher> = {
          teacher_id: staff_id,
         
          email: staff_email,
          created_on: new Date(),
          updated_on: new Date(),
          first_name: newTeacher.first_name ?? null,
          last_name: newTeacher.last_name ?? null,
          gender: newTeacher.gender,
          dob: newTeacher.dob,
          speciality:newTeacher.speciality,
          qualification:newTeacher.qualification,
          salary:newTeacher.salary,
          join_on:newTeacher.join_on,
          experience:newTeacher.experience,
          mobile: newTeacher.mobile,



       
          is_active: false,
          password: hashedPassword,
        };
  
       
  
        try {
         
          
            
          await this.teacher
            .createQueryBuilder()
            .insert()
            .into(Teacher)
            .values(teacher)
            .execute();
  
            await this.user
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([
              {email: teacher.email, password: hashedPassword, is_active: teacher.is_active, role: USER_ROLE.faculty},
              //{email: parent.parent_email, password: hashedPassword, is_active: parent.is_active, role: USER_ROLE.parent}
            ])
            .execute();
  
          return {
            msg: StatusOptions.SUCCESS,
            description: 'user added',
            data: teacher
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
