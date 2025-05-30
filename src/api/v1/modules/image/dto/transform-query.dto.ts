import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TransformQuery {
    @ApiPropertyOptional({ description: 'Width of the transformed image', example: '800' })
    @IsString()
    @IsOptional()
    w?: string;

    @ApiPropertyOptional({ description: 'Height of the transformed image', example: '600' })
    @IsString()
    @IsOptional()
    h?: string;

    @ApiPropertyOptional({ description: 'Fit mode for the transformed image', example: 'cover' })
    @IsString()
    @IsOptional()
    fit?: string;

    @ApiPropertyOptional({ description: 'Format of the transformed image', example: 'jpg' })
    @IsString()
    @IsOptional()
    format?: string;

    @ApiPropertyOptional({ description: 'Quality of the transformed image (0-100)', example: '80' })
    @IsString()
    @IsOptional()
    quality?: string;

    @ApiPropertyOptional({ description: 'Whether to apply grayscale effect', example: 'true' })
    @IsString()
    @IsOptional()
    grayscale?: string;

    @ApiPropertyOptional({
        description: 'Blur effect applied to the transformed image',
        example: '5',
    })
    @IsString()
    @IsOptional()
    blur?: string;

    @ApiPropertyOptional({ description: 'Whether to apply sharpening effect', example: 'true' })
    @IsString()
    @IsOptional()
    sharpen?: string;

    @ApiPropertyOptional({
        description: 'Rotation angle for the transformed image in degrees',
        example: '90',
    })
    @IsString()
    @IsOptional()
    rotate?: string;

    @ApiPropertyOptional({
        description: 'Crop settings for the transformed image',
        example: 'crop:fill',
    })
    @IsString()
    @IsOptional()
    crop?: string;

    @ApiPropertyOptional({
        description: 'Enhancement size for the transformed image',
        example: '2x',
    })
    @IsString()
    @IsOptional()
    enhance?: string;
}
