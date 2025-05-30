import { ForbiddenException } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { winstonLoggerConfig } from './common/loggers/logger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const allowedOrigins = process.env.ALLOWED_ORIGINS;

const corsOptions: CorsOptions = {
    origin: (
        origin: string,
        callback: (error: ForbiddenException | null, isAllow?: boolean) => void,
    ) => {
        if ((allowedOrigins && allowedOrigins.includes(origin)) || !origin) {
            callback(null, true);
        } else {
            callback(new ForbiddenException('Origin not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: winstonLoggerConfig,
    });
    const configService = app.get(ConfigService);

    app.enableCors(corsOptions);
    app.use(helmet());
    app.use(compression());
    app.use(cookieParser());

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('NestJS Image Server API')
        .setDescription('The NestJS Image Server API documentation')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
            security: [{ 'JWT-auth': [] }],
        },
    });

    const port = configService.get<number>('PORT') || 3001;
    await app.listen(port);

    const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
    logger.info(`Application is running on: http://localhost:${port}`);
    logger.info(`Swagger documentation is available at: http://localhost:${port}/api/docs`);
}

bootstrap();
