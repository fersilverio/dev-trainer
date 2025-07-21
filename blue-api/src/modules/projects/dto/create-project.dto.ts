import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    niche: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    ownerId: number;
}
