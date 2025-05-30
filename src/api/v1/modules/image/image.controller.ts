import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Inject,
    LoggerService,
    Query,
} from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { IImageCommandService } from './interfaces/image-command.service.interface';
import { IImageQueryService } from './interfaces/image-query.service.interface';
import { IMAGE_TOKENS } from './constants/inject-token';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { IImageTransformService } from 'src/api/v1/modules/image/interfaces/image-transform.service.interface';
import { TransformQuery } from 'src/api/v1/modules/image/dto/transform-query.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { User } from '@clerk/backend';
import { IImageVariantQueryService } from 'src/api/v1/modules/image/interfaces/image-variant-query.service.interface';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Image')
@Controller('images')
export class ImageController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        @Inject(IMAGE_TOKENS.SERVICES.COMMAND)
        private readonly imageCommandService: IImageCommandService,
        @Inject(IMAGE_TOKENS.SERVICES.QUERY)
        private readonly imageQueryService: IImageQueryService,
        @Inject(IMAGE_TOKENS.SERVICES.TRANSFORM)
        private readonly imageTransformService: IImageTransformService,
        @Inject(IMAGE_TOKENS.SERVICES.VARIANT_QUERY)
        private readonly imageVariantQueryService: IImageVariantQueryService,
    ) {}

    @Post()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new image' })
    @ApiResponse({
        status: 201,
        description: 'The image has been successfully created',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Bearer token required',
    })
    @ResponseMessage('Image created successfully')
    create(@Body() createImageDto: CreateImageDto) {
        this.logger.log(`Creating image for user: ${createImageDto.userId}`, ImageController.name);
        return this.imageCommandService.create(createImageDto);
    }

    @Get()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all images' })
    @ApiResponse({
        status: 200,
        description: 'List of all images',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Bearer token required',
    })
    @ResponseMessage('Images retrieved successfully')
    findAll() {
        this.logger.log('Finding all images', ImageController.name);
        return this.imageQueryService.findAll();
    }

    @Get('user')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all images for current user' })
    @ApiResponse({
        status: 200,
        description: 'List of images for the current user',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Bearer token required',
    })
    @ResponseMessage('Images retrieved successfully')
    findUserImages(@CurrentUser() user: User) {
        this.logger.log('Finding all images for user', ImageController.name);
        return this.imageQueryService.findUserImages(user);
    }

    @Get('transform/:id')
    @Public()
    @ApiOperation({ summary: 'Transform image by ID' })
    @ApiParam({
        name: 'id',
        description: 'The ID of the image to transform',
        type: 'string',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'The image has been successfully transformed',
    })
    @ApiResponse({
        status: 404,
        description: 'Image not found',
    })
    @ResponseMessage('Image transform successfully')
    async transformImage(@Param('id') id: string, @Query() query: TransformQuery) {
        this.logger.log(`Transform image by id: ${id}`, ImageController.name);
        return this.imageTransformService.transformImage(id, query);
    }

    @Get(':id/transformed')
    @Public()
    @ApiOperation({ summary: 'Get transformed image by ID' })
    @ApiParam({
        name: 'id',
        description: 'The ID of the transformed image to retrieve',
        type: 'string',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'The transformed image has been successfully retrieved',
    })
    @ApiResponse({
        status: 404,
        description: 'Transformed image not found',
    })
    @ResponseMessage('Image transform successfully')
    async getTransformedImage(@Param('id') id: string) {
        this.logger.log(`Finding transformed image: ${id}`, ImageController.name);
        return this.imageVariantQueryService.getTransformedImage(id);
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Get image by ID' })
    @ApiParam({
        name: 'id',
        description: 'The ID of the image to retrieve',
        type: 'string',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'The image has been successfully retrieved',
    })
    @ApiResponse({
        status: 404,
        description: 'Image not found',
    })
    @ResponseMessage('Images retrieved successfully')
    findOne(@Param('id') id: string) {
        this.logger.log(`Finding image by id: ${id}`, ImageController.name);
        return this.imageQueryService.findById(id);
    }

    @Patch(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update image by ID' })
    @ApiParam({
        name: 'id',
        description: 'The ID of the image to update',
        type: 'string',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'The image has been successfully updated',
    })
    @ApiResponse({
        status: 404,
        description: 'Image not found',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Bearer token required',
    })
    @ResponseMessage('Image updated successfully')
    update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
        this.logger.log(`Updating image: ${id}`, ImageController.name);
        return this.imageCommandService.update(id, updateImageDto);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete image by ID' })
    @ApiParam({
        name: 'id',
        description: 'The ID of the image to delete',
        type: 'string',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'The image has been successfully deleted',
    })
    @ApiResponse({
        status: 404,
        description: 'Image not found',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Bearer token required',
    })
    @ResponseMessage('Image deleted successfully')
    remove(@Param('id') id: string) {
        this.logger.log(`Deleting image: ${id}`, ImageController.name);
        return this.imageCommandService.delete(id);
    }
}
