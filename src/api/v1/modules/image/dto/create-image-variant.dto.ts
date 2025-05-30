import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EnhanceSize } from 'src/api/v1/modules/image/types/enhance.type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateImageVariantDto {
    @ApiProperty({ description: 'ID of the original image', example: 'image_1234567890' })
    @IsString()
    imageId: string;

    @ApiProperty({
        description: 'URL of the image variant',
        example: 'https://example.com/variant.jpg',
    })
    @IsString()
    url: string;

    @ApiProperty({ description: 'Public ID of the image variant', example: 'variant_1234567890' })
    @IsString()
    publicId: string;

    @ApiPropertyOptional({ description: 'Width of the image variant in pixels', example: 800 })
    @IsNumber()
    @IsOptional()
    width?: number;

    @ApiPropertyOptional({ description: 'Height of the image variant in pixels', example: 600 })
    @IsNumber()
    @IsOptional()
    height?: number;

    @ApiPropertyOptional({ description: 'Format of the image variant', example: 'jpg' })
    @IsString()
    @IsOptional()
    format?: string;

    @ApiPropertyOptional({ description: 'Quality of the image variant (0-100)', example: 80 })
    @IsNumber()
    @IsOptional()
    quality?: number;

    @ApiPropertyOptional({ description: 'Blur effect applied to the image variant', example: 5 })
    @IsNumber()
    @IsOptional()
    blur?: number;

    @ApiPropertyOptional({ description: 'Whether the image variant is grayscale', example: false })
    @IsBoolean()
    @IsOptional()
    grayscale?: boolean;

    @ApiPropertyOptional({ description: 'Whether the image variant is sharpened', example: false })
    @IsBoolean()
    @IsOptional()
    sharpen?: boolean;

    @ApiPropertyOptional({
        description: 'Crop settings for the image variant',
        example: 'crop:fill',
    })
    @IsString()
    @IsOptional()
    crop?: string;

    @ApiPropertyOptional({
        description: 'Fit settings for the image variant',
        example: 'fit:cover',
    })
    @IsString()
    @IsOptional()
    fit?: string;

    @ApiPropertyOptional({
        description: 'Enhancement size for the image variant',
        enum: ['2x', '4x', '8x'],
        example: '2x',
    })
    @IsEnum(['2x', '4x', '8x'])
    @IsOptional()
    enhance?: EnhanceSize;

    @ApiPropertyOptional({
        description: 'Rotation angle for the image variant in degrees',
        example: 90,
    })
    @IsNumber()
    @IsOptional()
    rotate?: number;
}
