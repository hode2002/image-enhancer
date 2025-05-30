import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { User } from '@clerk/backend';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Login user and get access token' })
    @ApiResponse({
        status: 200,
        description: 'User successfully logged in and received access token',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid credentials',
    })
    async login(@CurrentUser() user: User) {
        return this.authService.login(user);
    }
}
