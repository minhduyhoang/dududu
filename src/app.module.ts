import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { redisStore } from "cache-manager-redis-store";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { RedisCacheModule } from "./cache/cache.module";
import { CommonsModule } from "./commons/commons.module";
import { ExportExcelModule } from "./export-excel/export-excel.module";
import { HandleMessagesModule } from "./handle-messages/handle-messages.module";
import { PublicsModule } from "./publics/publics.module";
import { SessionsGateway } from "./sessions/sessions.gateway";
import { SessionsModule } from "./sessions/sessions.module";
import { UploadsModule } from "./uploads/uploads.module";
import { UsersGateway } from "./users/users.gateway";
import { UsersModule } from "./users/users.module";
import { config, configValidationSchema } from "./utils/config/config";
import { DatabaseConfig } from "./utils/config/database.config";
import { LANGUAGE, NODE_ENV } from "./utils/constant/constant";
import { AnyExceptionFilter } from "./utils/exception/http.exception";
import { VersionsModule } from "./versions/versions.module";
import { CacheModule } from "@nestjs/cache-manager";
import { LoggerModule } from "nestjs-pino";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
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
    CacheModule.registerAsync<any>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          url: configService.get("REDIS_URL"),
          ttl: 60,
          password: process.env.REDIS_PASSWORD,
        });
        return {
          store: () => store,
        };
      },
      inject: [ConfigService],
    }),
    I18nModule.forRootAsync({
      inject: [ConfigService],
      resolvers: [AcceptLanguageResolver],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: LANGUAGE.EN,
        loaderOptions: {
          path: join(__dirname, "/i18n/"),
          watch: true,
        },
      }),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== NODE_ENV.PRODUCTION ? "debug" : "info",
        transport:
          process.env.NODE_ENV !== NODE_ENV.PRODUCTION
            ? { target: "pino-pretty" }
            : undefined,
      },
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
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AnyExceptionFilter,
    },
    UsersGateway,
    SessionsGateway,
  ],
})
export class AppModule {}
