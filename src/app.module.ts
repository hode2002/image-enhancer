import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './api/v1/modules/auth/auth.module';
import { UserModule } from './api/v1/modules/user/user.module';
import { SupabaseModule } from './api/v1/modules/supabase/supabase.module';
import { CoreModule } from './api/v1/modules/core/core.module';
import { MediaModule } from './api/v1/modules/media/media.module';
import { ClerkClientProvider } from 'src/common/providers/clerk-client.provider';

import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './common/loggers/logger';
import { ImageModule } from 'src/api/v1/modules/image/image.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        WinstonModule.forRoot({
            instance: winstonLogger,
        }),
        SupabaseModule,
        CoreModule,
        MediaModule,
        AuthModule,
        UserModule,
        ImageModule,
    ],
    providers: [ClerkClientProvider],
})
export class AppModule {}
