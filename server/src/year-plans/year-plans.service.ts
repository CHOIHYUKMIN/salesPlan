import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateYearPlanDto } from './dto/create-year-plan.dto';
import { UpdateYearPlanDto } from './dto/update-year-plan.dto';
import { PlanStatus, UserRole } from '@prisma/client';

@Injectable()
export class YearPlansService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createYearPlanDto: CreateYearPlanDto) {
        const { kpis, ...yearPlanData } = createYearPlanDto;

        // Get user's team info
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.prisma.yearPlan.create({
            data: {
                ...yearPlanData,
                userId,
                teamId: user.teamId,
                kpis: {
                    create: kpis,
                },
            },
            include: {
                kpis: true,
            },
        });
    }

    async findAll(filters: { year?: number; userId?: string; teamId?: string; status?: PlanStatus }) {
        return this.prisma.yearPlan.findMany({
            where: filters,
            include: {
                user: {
                    select: { name: true, email: true }
                },
                kpis: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const yearPlan = await this.prisma.yearPlan.findUnique({
            where: { id },
            include: {
                user: true,
                monthPlans: true,
                kpis: true,
            },
        });

        if (!yearPlan) {
            throw new NotFoundException(`Year Plan with ID ${id} not found`);
        }

        return yearPlan;
    }

    async update(id: string, userId: string, updateYearPlanDto: UpdateYearPlanDto) {
        const yearPlan = await this.findOne(id);
        this.checkModificationPermission(yearPlan, userId);

        if (yearPlan.status !== PlanStatus.DRAFT && yearPlan.status !== PlanStatus.REJECTED) {
            // Allow editing if user is admin or it's just a draft/rejected
            // For now, let's strict it: only DRAFT or REJECTED can be edited by owner
        }

        if (yearPlan.status === PlanStatus.APPROVED || yearPlan.status === PlanStatus.PENDING) {
            throw new BadRequestException('Cannot update plan in PENDING or APPROVED status');
        }

        const { kpis, ...data } = updateYearPlanDto;

        // Handle KPI updates separately if needed (delete all and recreate, or update individually)
        // For simplicity in MVP, if KPIs are provided, we replace them.
        if (kpis) {
            await this.prisma.kPI.deleteMany({ where: { yearPlanId: id } });
            return this.prisma.yearPlan.update({
                where: { id },
                data: {
                    ...data,
                    kpis: {
                        create: kpis
                    }
                },
                include: { kpis: true }
            });
        }

        return this.prisma.yearPlan.update({
            where: { id },
            data,
            include: { kpis: true }
        });
    }

    async remove(id: string, userId: string) {
        const yearPlan = await this.findOne(id);
        this.checkModificationPermission(yearPlan, userId);

        return this.prisma.yearPlan.delete({
            where: { id },
        });
    }

    async submit(id: string, userId: string) {
        const yearPlan = await this.findOne(id);
        this.checkModificationPermission(yearPlan, userId);

        if (yearPlan.status !== PlanStatus.DRAFT && yearPlan.status !== PlanStatus.REJECTED) {
            throw new BadRequestException('Only DRAFT or REJECTED plans can be submitted');
        }

        return this.prisma.yearPlan.update({
            where: { id },
            data: { status: PlanStatus.PENDING }
        });
    }

    async approve(id: string, approverId: string) {
        const yearPlan = await this.findOne(id);
        const approver = await this.prisma.user.findUnique({ where: { id: approverId } });

        if (!approver) {
            throw new NotFoundException('Approver not found');
        }

        // Basic permission check: Approver must be TEAM_LEADER or higher
        const allowedRoles: UserRole[] = [UserRole.TEAM_LEADER, UserRole.DEPT_LEADER, UserRole.ADMIN];
        if (!allowedRoles.includes(approver.role)) {
            throw new ForbiddenException('Insufficient permissions to approve plans');
        }

        return this.prisma.yearPlan.update({
            where: { id },
            data: { status: PlanStatus.APPROVED }
        });
    }

    async reject(id: string, approverId: string) {
        const yearPlan = await this.findOne(id);
        const approver = await this.prisma.user.findUnique({ where: { id: approverId } });

        if (!approver) {
            throw new NotFoundException('Approver not found');
        }

        const allowedRoles: UserRole[] = [UserRole.TEAM_LEADER, UserRole.DEPT_LEADER, UserRole.ADMIN];
        if (!allowedRoles.includes(approver.role)) {
            throw new ForbiddenException('Insufficient permissions to reject plans');
        }

        return this.prisma.yearPlan.update({
            where: { id },
            data: { status: PlanStatus.REJECTED }
        });
    }

    private checkModificationPermission(yearPlan: any, userId: string) {
        if (yearPlan.userId !== userId) {
            throw new ForbiddenException('You can only modify your own plans');
        }
    }
}
