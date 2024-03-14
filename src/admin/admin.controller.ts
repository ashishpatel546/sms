import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { NewStudentDto } from './dto/newStudent.dto';
import { NewClassDto } from './dto/newClass.dto';
import { NewExamDto } from './dto/newExam.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { log } from 'console';
import { NewExamScoreDto } from './dto/newExamScore.dto';

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
  @Post('/set-teacher-data')
  setTeacher(@Body() body: NewTeacherDto) {
    return this.adminService.setTeacher(body);
  }

  @Post('/set-class-data')
  setClass(@Body() body: NewClassDto) {
    return this.adminService.setClass(body);
  }
  @Post('/timetable')
  async updateTimetable(@Body() newTimetableDto: UpdateTimetableDto) {
    await this.adminService.addnewTimetable(newTimetableDto);
  }

  @Get('/get-class-data')
  getClass() {
    return this.adminService.getClass();
  }

  @Post('/set-exam-data')
  setExam(@Body() body: NewExamDto) {
    return this.adminService.setExam(body);
  }

  @Post('/set-exam-score-data')
  setExamScore(@Body() body: NewExamScoreDto) {
    return this.adminService.setExamScore(body);
  }

  @Get('/send-exam-reminder')
  sendExamReminders() {
    return this.adminService.sendExamReminders();
  }
}
