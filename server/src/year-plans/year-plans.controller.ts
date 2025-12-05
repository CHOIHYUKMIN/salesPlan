import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { YearPlansService } from './year-plans.service';
import { CreateYearPlanDto } from './dto/create-year-plan.dto';
import { UpdateYearPlanDto } from './dto/update-year-plan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlanStatus } from '@prisma/client';

@Controller('year-plans')
@UseGuards(JwtAuthGuard)
export class YearPlansController {
    constructor(private readonly yearPlansService: YearPlansService) { }

    @Post()
    create(@Request() req, @Body() createYearPlanDto: CreateYearPlanDto) {
        return this.yearPlansService.create(req.user.id, createYearPlanDto);
    }

    @Get()
    findAll(
        @Query('year') year?: string,
        @Query('status') status?: PlanStatus,
        @Query('userId') userId?: string,
        @Request() req?,
    ) {
        const filters: any = {};
        if (year) filters.year = +year;
        if (status) filters.status = status;
        if (userId) filters.userId = userId;

        // Optional: Filter by team if user is TEAM_LEADER, etc.
        // For now, return all matching public filters.

        return this.yearPlansService.findAll(filters);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.yearPlansService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Request() req, @Body() updateYearPlanDto: UpdateYearPlanDto) {
        return this.yearPlansService.update(id, req.user.id, updateYearPlanDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.yearPlansService.remove(id, req.user.id);
    }

    @Post(':id/submit')
    submit(@Param('id') id: string, @Request() req) {
        return this.yearPlansService.submit(id, req.user.id);
    }

    @Post(':id/approve')
    approve(@Param('id') id: string, @Request() req) {
        return this.yearPlansService.approve(id, req.user.id);
    }

    @Post(':id/reject')
    reject(@Param('id') id: string, @Request() req) {
        return this.yearPlansService.reject(id, req.user.id);
    }
}
