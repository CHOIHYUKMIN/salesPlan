import { IsInt, IsNotEmpty, IsString, IsOptional, ValidateNested, Min, IsArray, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class CreateKpiDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(0)
    target: number;

    @IsString()
    @IsNotEmpty()
    unit: string;
}

export class CreateYearPlanDto {
    @IsInt()
    @Min(2024)
    year: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateKpiDto)
    @IsOptional()
    kpis?: CreateKpiDto[];
}
