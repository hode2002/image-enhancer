import {
    Controller,
    Post,
    Delete,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Inject,
    LoggerService,
    Query,
    Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MEDIA_TOKENS } from 'src/api/v1/modules/media/constants/inject-token';
import { UploadImageUrlDto } from 'src/api/v1/modules/media/dto/upload-url.dto';
import { IMediaCommandService } from 'src/api/v1/modules/media/interfaces/media-command.service.interface';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
    ApiBody,
} from '@nestjs/swagger';

@ApiTags('Media')
@ApiBearerAuth('JWT-auth')
@Controller('media')
export class MediaController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        @Inject(MEDIA_TOKENS.SERVICES.COMMAND)
        private readonly mediaCommandService: IMediaCommandService,
    ) {}

    @Post('upload')
    @ApiOperation({ summary: 'Upload an image file' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Invalid file or request' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        this.logger.log(`Processing upload request for: ${file?.originalname}`);
        return this.mediaCommandService.uploadImage(file);
    }

    @Post('upload-url')
    @ApiOperation({ summary: 'Upload an image by URL' })
    @ApiResponse({ status: 201, description: 'Image uploaded successfully from URL' })
    @ApiResponse({ status: 400, description: 'Invalid URL or request' })
    @ApiBody({ type: UploadImageUrlDto })
    async uploadByUrl(@Body() body: UploadImageUrlDto) {
        this.logger.log(`Processing upload url: ${body.imageUrl}`);
        return this.mediaCommandService.uploadByUrl(body.imageUrl);
    }

    @Delete()
    @ApiOperation({ summary: 'Delete an image by publicId' })
    @ApiQuery({
        name: 'publicId',
        description: 'The public ID of the image to delete',
        type: 'string',
        required: true,
        example: 'sample-image-public-id',
    })
    @ApiResponse({ status: 200, description: 'Image deleted successfully' })
    @ApiResponse({ status: 400, description: 'Public ID is required' })
    async deleteImage(@Query('publicId') publicId: string) {
        if (!publicId) {
            throw new BadRequestException('Public ID is required');
        }

        this.logger.log(`Processing delete request for image: ${publicId}`);
        await this.mediaCommandService.deleteImage(publicId);
        return { message: 'Image deleted successfully' };
    }
}
