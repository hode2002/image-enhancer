import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateImageDto {
    @ApiPropertyOptional({
        description: 'URL of the image',
        example: 'https://example.com/image.jpg',
    })
    @IsString()
    @IsOptional()
    url?: string;

    @ApiPropertyOptional({
        description: 'User ID associated with the image',
        example: 'user_1234567890',
    })
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiPropertyOptional({ description: 'Width of the image in pixels', example: 800 })
    @IsNumber()
    @IsOptional()
    width?: number;

    @ApiPropertyOptional({ description: 'Height of the image in pixels', example: 600 })
    @IsNumber()
    @IsOptional()
    height?: number;

    @ApiPropertyOptional({ description: 'Whether the image has been transformed', example: false })
    @IsBoolean()
    @IsOptional()
    transformed?: boolean;
}
