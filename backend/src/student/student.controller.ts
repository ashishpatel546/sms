import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Student } from 'src/entities/student.entity';

@Controller('student')
export class StudentController {
    constructor(private readonly studentService:StudentService){}


    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get('/get-student-profile')
    getProfile(@CurrentUser() stu: Partial<Student>){
        const emailParts = stu.email.split('_');
        const student_id = emailParts[0];
        return this.studentService.getProfile(student_id);
    }
    
}
