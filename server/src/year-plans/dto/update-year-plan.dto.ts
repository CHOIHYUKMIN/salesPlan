import { PartialType } from '@nestjs/mapped-types';
import { CreateYearPlanDto } from './create-year-plan.dto';

export class UpdateYearPlanDto extends PartialType(CreateYearPlanDto) { }
