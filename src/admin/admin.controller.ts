import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { NewStudentDto } from './dto/newStudent.dto';
import { NewClassDto } from './dto/newClass.dto';
import { NewExamDto } from './dto/newExam.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/get-student-data')
  getStudent() {
    return this.adminService.getStudent();
  }

  @Post('/set-student-data')
  setStudent(@Body() body: NewStudentDto) {
    return this.adminService.setStudent(body);
  }

  @Post('/set-class-data')
  setClass(@Body() body: NewClassDto) {
    return this.adminService.setClass(body);
  }

  @Get('/get-class-data')
  getClass() {
    return this.adminService.getClass();
  }

  @Post('/set-exam-data')
  setSubject(@Body() body: NewExamDto) {
    return this.adminService.setExam(body);
  }
}
