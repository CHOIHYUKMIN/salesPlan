import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { MonthPlansService } from './month-plans.service';
import { CreateMonthPlanDto } from './dto/create-month-plan.dto';
import { UpdateMonthPlanDto } from './dto/update-month-plan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlanStatus } from '@prisma/client';

@Controller('month-plans')
@UseGuards(JwtAuthGuard)
export class MonthPlansController {
    constructor(private readonly monthPlansService: MonthPlansService) { }

    @Post()
    create(@Request() req, @Body() createMonthPlanDto: CreateMonthPlanDto) {
        return this.monthPlansService.create(req.user.id, createMonthPlanDto);
    }

    @Get()
    findAll(
        @Query('yearPlanId') yearPlanId?: string,
        @Query('month') month?: string,
        @Query('status') status?: PlanStatus,
        @Query('userId') userId?: string,
        @Request() req?,
    ) {
        const filters: any = {};
        if (yearPlanId) filters.yearPlanId = yearPlanId;
        if (month) filters.month = +month;
        if (status) filters.status = status;
        if (userId) filters.userId = userId;

        return this.monthPlansService.findAll(filters);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.monthPlansService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Request() req, @Body() updateMonthPlanDto: UpdateMonthPlanDto) {
        return this.monthPlansService.update(id, req.user.id, updateMonthPlanDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.monthPlansService.remove(id, req.user.id);
    }

    @Post(':id/submit')
    submit(@Param('id') id: string, @Request() req) {
        return this.monthPlansService.submit(id, req.user.id);
    }

    @Post(':id/approve')
    approve(@Param('id') id: string, @Request() req) {
        return this.monthPlansService.approve(id, req.user.id);
    }

    @Post(':id/reject')
    reject(@Param('id') id: string, @Request() req) {
        return this.monthPlansService.reject(id, req.user.id);
    }
}
