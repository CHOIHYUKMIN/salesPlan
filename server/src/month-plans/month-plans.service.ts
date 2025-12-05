import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMonthPlanDto } from './dto/create-month-plan.dto';
import { UpdateMonthPlanDto } from './dto/update-month-plan.dto';
import { PlanStatus, UserRole } from '@prisma/client';

@Injectable()
export class MonthPlansService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createMonthPlanDto: CreateMonthPlanDto) {
        const { yearPlanId, ...data } = createMonthPlanDto;

        // Verify Year Plan exists
        const yearPlan = await this.prisma.yearPlan.findUnique({
            where: { id: yearPlanId },
        });

        if (!yearPlan) {
            throw new NotFoundException('Year Plan not found');
        }

        // Verify User matches Year Plan owner (optional, depending on requirements. Assuming owner creates month plans too)
        if (yearPlan.userId !== userId) {
            throw new ForbiddenException('You can only create month plans for your own year plan');
        }

        // Get user's team info for redundancy in month plan
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.prisma.monthPlan.create({
            data: {
                ...data,
                yearPlanId,
                userId,
                teamId: user.teamId,
            },
        });
    }

    async findAll(filters: { yearPlanId?: string; userId?: string; teamId?: string; month?: number; status?: PlanStatus }) {
        return this.prisma.monthPlan.findMany({
            where: filters,
            include: {
                user: { select: { name: true, email: true } },
                yearPlan: true,
            },
            orderBy: { month: 'asc' },
        });
    }

    async findOne(id: string) {
        const monthPlan = await this.prisma.monthPlan.findUnique({
            where: { id },
            include: {
                user: true,
                yearPlan: true,
                tasks: true,
            },
        });

        if (!monthPlan) {
            throw new NotFoundException(`Month Plan with ID ${id} not found`);
        }

        return monthPlan;
    }

    async update(id: string, userId: string, updateMonthPlanDto: UpdateMonthPlanDto) {
        const monthPlan = await this.findOne(id);
        this.checkModificationPermission(monthPlan, userId);

        if (monthPlan.status !== PlanStatus.DRAFT && monthPlan.status !== PlanStatus.REJECTED) {
            // Allow modification only in DRAFT or REJECTED
        }

        if (monthPlan.status === PlanStatus.APPROVED || monthPlan.status === PlanStatus.PENDING) {
            throw new BadRequestException('Cannot update plan in PENDING or APPROVED status');
        }

        return this.prisma.monthPlan.update({
            where: { id },
            data: updateMonthPlanDto,
        });
    }

    async remove(id: string, userId: string) {
        const monthPlan = await this.findOne(id);
        this.checkModificationPermission(monthPlan, userId);

        return this.prisma.monthPlan.delete({
            where: { id },
        });
    }

    async submit(id: string, userId: string) {
        const monthPlan = await this.findOne(id);
        this.checkModificationPermission(monthPlan, userId);

        if (monthPlan.status !== PlanStatus.DRAFT && monthPlan.status !== PlanStatus.REJECTED) {
            throw new BadRequestException('Only DRAFT or REJECTED plans can be submitted');
        }

        return this.prisma.monthPlan.update({
            where: { id },
            data: { status: PlanStatus.PENDING }
        });
    }

    async approve(id: string, approverId: string) {
        const monthPlan = await this.findOne(id);
        const approver = await this.prisma.user.findUnique({ where: { id: approverId } });

        if (!approver) {
            throw new NotFoundException('Approver not found');
        }

        const allowedRoles: UserRole[] = [UserRole.TEAM_LEADER, UserRole.DEPT_LEADER, UserRole.ADMIN];
        if (!allowedRoles.includes(approver.role)) {
            throw new ForbiddenException('Insufficient permissions to approve plans');
        }

        return this.prisma.monthPlan.update({
            where: { id },
            data: { status: PlanStatus.APPROVED }
        });
    }

    async reject(id: string, approverId: string) {
        const monthPlan = await this.findOne(id);
        const approver = await this.prisma.user.findUnique({ where: { id: approverId } });

        if (!approver) {
            throw new NotFoundException('Approver not found');
        }

        const allowedRoles: UserRole[] = [UserRole.TEAM_LEADER, UserRole.DEPT_LEADER, UserRole.ADMIN];
        if (!allowedRoles.includes(approver.role)) {
            throw new ForbiddenException('Insufficient permissions to reject plans');
        }

        return this.prisma.monthPlan.update({
            where: { id },
            data: { status: PlanStatus.REJECTED }
        });
    }

    private checkModificationPermission(monthPlan: any, userId: string) {
        if (monthPlan.userId !== userId) {
            throw new ForbiddenException('You can only modify your own plans');
        }
    }
}
