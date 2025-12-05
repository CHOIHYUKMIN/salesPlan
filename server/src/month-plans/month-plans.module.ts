import { Module } from '@nestjs/common';
import { MonthPlansService } from './month-plans.service';
import { MonthPlansController } from './month-plans.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [MonthPlansController],
    providers: [MonthPlansService],
    exports: [MonthPlansService],
})
export class MonthPlansModule { }
