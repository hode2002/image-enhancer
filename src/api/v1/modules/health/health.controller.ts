import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Get()
    @Public()
    @ApiOperation({ summary: 'Check API health status' })
    @ApiResponse({
        status: 200,
        description: 'The API is healthy',
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    example: 'ok',
                },
                timestamp: {
                    type: 'string',
                    example: '2024-03-20T12:00:00.000Z',
                },
            },
        },
    })
    @ApiResponse({
        status: 503,
        description: 'The API is unhealthy',
    })
    check() {
        return this.healthService.check();
    }
}
