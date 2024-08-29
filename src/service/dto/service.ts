import { IsNotEmpty, IsString, IsArray, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    sampling: string;

    @IsOptional()
    @IsString()
    result: string;

    @IsOptional()
    @IsString()
    condition?: string;

    @IsOptional()
    @IsNumber()
    numSampleSupport: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    room?: string[];
}

export class UpdateServiceDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    sampling: string;

    @IsOptional()
    @IsString()
    result: string;

    @IsOptional()
    @IsString()
    condition?: string;

    @IsOptional()
    @IsNumber()
    numSampleSupport: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    room?: string[];
}