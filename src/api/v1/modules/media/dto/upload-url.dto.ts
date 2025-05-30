import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImageUrlDto {
    @ApiProperty({
        description: 'URL of the image',
        example: 'https://example.com/image.jpg',
    })
    @IsString()
    @IsNotEmpty()
    imageUrl: string;
}
