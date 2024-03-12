import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { NewStudentDto } from './dto/newStudent.dto';
import { NewTeacherDto } from './dto/newTeacher.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService){}

    @Get('/get-student-data')
    getStudent(){
        return this.adminService.getStudent();
    }

    @Post('/set-student-data')
    setStudent(@Body() body:NewStudentDto){
        return this.adminService.setStudent(body);
    }
    @Post('/set-teacher-data')
    setTeacher(@Body() body:NewTeacherDto){
        return this.adminService.setTeacher(body);
    }

    
}
