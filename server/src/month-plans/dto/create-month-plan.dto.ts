import { IsInt, IsNotEmpty, IsString, IsOptional, Min, Max, IsUUID } from 'class-validator';

export class CreateMonthPlanDto {
    @IsUUID()
    @IsNotEmpty()
    yearPlanId: string;

    @IsInt()
    @Min(1)
    @Max(12)
    month: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;
}
