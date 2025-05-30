import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
    @ApiProperty({ description: 'Public ID of the image', example: 'image_1234567890' })
    @IsString()
    publicId: string;

    @ApiProperty({ description: 'User ID associated with the image', example: 'user_1234567890' })
    @IsString()
    userId: string;

    @ApiProperty({
        description: 'Original URL of the image',
        example: 'https://example.com/image.jpg',
    })
    @IsString()
    originalUrl: string;

    @ApiProperty({ description: 'Width of the image in pixels', example: 800 })
    @IsNumber()
    width: number;

    @ApiProperty({ description: 'Height of the image in pixels', example: 600 })
    @IsNumber()
    height: number;

    @ApiProperty({ description: 'Size of the image in bytes', example: 1024 })
    @IsNumber()
    size: number;

    @ApiProperty({ description: 'Format of the image', example: 'jpg' })
    @IsString()
    format: string;
}
