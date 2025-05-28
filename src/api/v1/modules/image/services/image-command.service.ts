import { Injectable, Inject, LoggerService, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IImageCommandService } from '../interfaces/image-command.service.interface';
import { CreateImageDto } from '../dto/create-image.dto';
import { UpdateImageDto } from '../dto/update-image.dto';
import { Image } from 'generated/prisma';
import { IMAGE_TOKENS } from '../constants/inject-token';
import { IImageCommandRepository } from '../interfaces/image-command.repository.interface';
import { USER_TOKENS } from 'src/api/v1/modules/user/constants/inject-token';
import { IUserQueryService } from 'src/api/v1/modules/user/interfaces/user-query.service.interface';
import { IImageQueryRepository } from 'src/api/v1/modules/image/interfaces/image-query.repository.interface';
import { ImageWhereInput } from 'src/api/v1/modules/image/types/query.type';
import { IImageQueryService } from 'src/api/v1/modules/image/interfaces/image-query.service.interface';
import { CLOUDINARY_TOKENS } from 'src/api/v1/modules/cloudinary/constants/inject-token';
import { ICloudinaryService } from 'src/api/v1/modules/cloudinary/interfaces/cloudinary.service.interface';

@Injectable()
export class ImageCommandService implements IImageCommandService {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        @Inject(IMAGE_TOKENS.REPOSITORIES.COMMAND)
        private readonly imageCommandRepository: IImageCommandRepository,
        @Inject(IMAGE_TOKENS.REPOSITORIES.QUERY)
        private readonly imageQueryRepository: IImageQueryRepository,
        @Inject(USER_TOKENS.SERVICES.QUERY)
        private readonly UserQueryService: IUserQueryService,
        @Inject(IMAGE_TOKENS.SERVICES.QUERY)
        private readonly imageQueryService: IImageQueryService,
        @Inject(CLOUDINARY_TOKENS.PROVIDER)
        private readonly uploadService: ICloudinaryService,
    ) {}

    async create(createImageDto: CreateImageDto): Promise<Image> {
        const { userId, publicId, originalUrl, width, height } = createImageDto;
        const user = await this.UserQueryService.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with id: ${userId} not found`);
        }

        const where: ImageWhereInput = {
            publicId,
            userId,
            originalUrl,
            width,
            height,
        };
        const existingImage = await this.imageQueryRepository.findFirst(where);
        if (existingImage) {
            return existingImage;
        }

        this.logger.log(`Creating image for user: ${userId}`, ImageCommandService.name);
        return this.imageCommandRepository.create(createImageDto);
    }

    async update(id: string, updateImageDto: UpdateImageDto): Promise<Image> {
        this.logger.log(`Updating image: ${id}`, ImageCommandService.name);
        return this.imageCommandRepository.update(id, updateImageDto);
    }

    async delete(id: string): Promise<Image> {
        this.logger.log(`Deleting image: ${id}`, ImageCommandService.name);
        const existingImage = await this.imageQueryService.findById(id);
        this.uploadService.deleteImage(existingImage!.publicId);

        return this.imageCommandRepository.delete(id);
    }
}
