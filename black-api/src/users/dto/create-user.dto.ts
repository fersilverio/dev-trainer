import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength, IsEmail, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @ApiProperty({ example: "John Doe", required: true })
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: "exemple@example.com", required: true })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty({ example: "a-desired-password", required: true })
    password: string;
}
