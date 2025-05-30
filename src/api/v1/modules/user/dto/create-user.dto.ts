import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'Clerk user ID', example: 'user_1234567890' })
    @IsString()
    clerkId: string;

    @ApiProperty({ description: 'User email address', example: 'user@example.com' })
    @IsEmail()
    email: string;
}
