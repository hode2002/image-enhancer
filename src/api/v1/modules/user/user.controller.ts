import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Put,
    Inject,
    LoggerService,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { IUserQueryService } from './interfaces/user-query.service.interface';
import { USER_TOKENS } from './constants/inject-token';
import { IUserCommandService } from 'src/api/v1/modules/user/interfaces/user-command.service.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from '@clerk/backend';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(ClerkAuthGuard)
export class UserController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        @Inject(USER_TOKENS.SERVICES.QUERY)
        private readonly userQueryService: IUserQueryService,
        @Inject(USER_TOKENS.SERVICES.COMMAND)
        private readonly userCommandService: IUserCommandService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async create(@Body() createUserDto: CreateUserDto) {
        this.logger.log(`Creating user with email: ${createUserDto.email}`, UserController.name);
        return this.userCommandService.create(createUserDto);
    }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Current user profile returned' })
    async getProfile(@CurrentUser() user: User) {
        this.logger.log('Fetching current user', UserController.name);
        return user;
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'List of all users' })
    async findAll() {
        this.logger.log('Fetching all users', UserController.name);
        return this.userQueryService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({
        name: 'id',
        description: 'User ID',
        type: 'string',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({ status: 200, description: 'User found' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id') id: string) {
        this.logger.log(`Finding user with id: ${id}`, UserController.name);
        return this.userQueryService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user by ID' })
    @ApiParam({
        name: 'id',
        description: 'User ID',
        type: 'string',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async update(@Param('id') id: string, @Body() updateUserDto: Partial<CreateUserDto>) {
        this.logger.log(`Updating user with ID: ${id}`, UserController.name);
        return this.userCommandService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiParam({
        name: 'id',
        description: 'User ID',
        type: 'string',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async remove(@Param('id') id: string) {
        this.logger.log(`Deleting user with ID: ${id}`, UserController.name);
        return this.userCommandService.delete(id);
    }
}
