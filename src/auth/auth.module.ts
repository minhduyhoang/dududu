import { forwardRef, Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { SessionsModule } from '../sessions/sessions.module';
import { NaverAuthService } from './services/naver-auth.service';
import { KaKaoAuthService } from './services/kakao-auth.service';
import { HttpModule } from '@nestjs/axios';
import { AxiosService } from 'src/utils/http/axios.service';
import { AppleAuthService } from './services/apple-auth.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => SessionsModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [AuthService, AppleAuthService, NaverAuthService, KaKaoAuthService, AxiosService, JwtStrategy, JwtRefreshTokenStrategy, FirebaseService],
  exports: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
