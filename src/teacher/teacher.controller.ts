import { Controller, Get, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Teacher } from 'src/entities/teacher.entity';

@Controller('teacher')
export class TeacherController {
constructor(private readonly teacherService:TeacherService){}

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get('/get-teacher-profile')
    getProfile(@CurrentUser() staff: Partial<Teacher>){
        const emailParts = staff.email.split('_');
        const teacher_id = emailParts[0];
        return this.teacherService.getProfile(teacher_id);
    }
}
