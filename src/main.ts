import { ForbiddenException } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

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
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.enableCors(corsOptions);

    app.use(helmet());
    app.use(compression());
    app.use(cookieParser());

    app.setGlobalPrefix('api/v1');

    const port = configService.get<number>('PORT') || 3001;
    await app.listen(port);
}

bootstrap();
