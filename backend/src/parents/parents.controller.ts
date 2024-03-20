import { Controller, Get, UseGuards } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Parent } from 'src/entities/parent.entity';

@Controller('parents')
export class ParentsController {
    constructor(private readonly parentsService:ParentsService){}

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get('/get-parents-profile')
    getProfile(@CurrentUser() parents: Partial<Parent>){
        console.log(parents);
        if (!parents || !parents.email) {
            throw new Error('Parent email is missing or undefined');
        }
        const emailParts = parents.email.split('_');
        console.log(emailParts);
        const parents_id = emailParts[0];
        console.log(parents_id)
        return this.parentsService.getProfile(parents_id);
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get('/get-exam-results')
    async getExamResults(@CurrentUser() parent: Partial<Parent>) {
        if (!parent || !parent.email) {
            throw new Error('Parent email is missing or undefined');
        }

        const emailParts = parent.email.split('_');
        const parentId = emailParts[0];

        return await this.parentsService.getExamResults(parentId);

        
        
        
    }

}
