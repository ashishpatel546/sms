import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Student } from 'src/entities/student.entity';
import { ParentsService } from 'src/parents/parents.service';
import { Parent } from 'src/entities/parent.entity';

@Controller('student')
export class StudentController {
    constructor(private readonly studentService:StudentService,
        private readonly parentsService:ParentsService
        ){}


    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get('/get-student-profile')
    getProfile(@CurrentUser() stu: Partial<Student>){
        const emailParts = stu.email.split('_');
        const student_id = emailParts[0];
        return this.studentService.getProfile(student_id);
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get('/get-exam-results')
    async getExamResults(@CurrentUser() student: Partial<Student>) {
        if (!student || !student.email) {
            throw new Error('student email is missing or undefined');
        }

        const emailParts = student.email.split('_');
        const studentId = emailParts[0];

        return await this.parentsService.getExamResults(studentId);

        
        
        
    }

    
}
