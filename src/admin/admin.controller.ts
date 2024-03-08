import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { NewStudentDto } from './dto/newStudent.dto';

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

    
}
