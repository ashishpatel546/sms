import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { NewStudentDto } from './dto/newStudent.dto';
import { NewTeacherDto } from './dto/newTeacher.dto';
import { NewClassDto } from './dto/newClass.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { log } from 'console';

@Controller('admin')
export class AdminController {
    
  constructor(private readonly adminService: AdminService) {}

  @Get('/get-student-data')
  getStudent() {
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


  @Post('/set-class-data')
  setClass(@Body() body: NewClassDto) {
    return this.adminService.setClass(body);
  }
  @Post('/timetable')
  async updateTimetable(
    
    @Body() newTimetableDto: UpdateTimetableDto,
  ) {
    
    try {
        
      await this.adminService.addnewTimetable( newTimetableDto);
      
      return { message: 'Timetable updated successfully' };
    } catch (error) {
      throw new Error('Failed to update timetable');
    }
  }

  
}
