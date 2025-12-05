import { PartialType } from '@nestjs/mapped-types';
import { CreateMonthPlanDto } from './create-month-plan.dto';

export class UpdateMonthPlanDto extends PartialType(CreateMonthPlanDto) { }
