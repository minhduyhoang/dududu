import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import type { ClientOpts as RedisClientOpts } from 'redis';
import { AuthModule } from './auth/auth.module';
import { RedisCacheModule } from './cache/cache.module';
import { ExportExcelModule } from './export-excel/export-excel.module';
import { HandleMessagesModule } from './handle-messages/handle-messages.module';
import { SessionsGateway } from './sessions/sessions.gateway';
import { SessionsModule } from './sessions/sessions.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersGateway } from './users/users.gateway';
import { UsersModule } from './users/users.module';
import { config, configValidationSchema } from './utils/config/config';
import { DatabaseConfig } from './utils/config/database.config';
import { LANGUAGE } from './utils/constant/constant';
import { ExceptionFilterCustom } from './utils/filter/exception.filter';
import { VersionsModule } from './versions/versions.module';
import { PublicsModule } from './publics/publics.module';
import { CommonsModule } from './commons/commons.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    CacheModule.register<RedisClientOpts>({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    I18nModule.forRoot({
      fallbackLanguage: LANGUAGE.EN,
      parserOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      parser: I18nJsonParser,
    }),
    RedisCacheModule,
    UsersModule,
    AuthModule,
    SessionsModule,
    HandleMessagesModule,
    UploadsModule,
    ExportExcelModule,
    VersionsModule,
    PublicsModule,
    CommonsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilterCustom,
    },
    UsersGateway,
    SessionsGateway,
  ],
})
export class AppModule {}
