import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CacheTtlSeconds, CACHE_SESSION } from 'src/cache/cache.constant';
import { CacheService } from 'src/cache/cache.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ETokenType, IToken, IVerifyInfo } from '../auth/auth.interface';
import { SessionsService } from '../sessions/sessions.service';
import { UserLoginDto, UserLoginSNSDto, UserRegisterDto } from '../users/users.dto';
import { IReqUser, ISuccessResponse, Response } from '../utils/interface/common.interface';
import { AuthErrorMessage } from './auth.error';
import { AppleAuthService } from './services/apple-auth.service';
import { KaKaoAuthService } from './services/kakao-auth.service';
import { NaverAuthService } from './services/naver-auth.service';
import { UserType } from 'src/users/users.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
    private readonly appleAuthService: AppleAuthService,
    private readonly naverAuthService: NaverAuthService,
    private readonly kakaoAuthService: KaKaoAuthService,
    private readonly cacheService: CacheService
  ) {}

  async login(userLoginDto: UserLoginDto): Promise<ISuccessResponse> {
    const [user, session] = await this.usersService.signIn(userLoginDto);

    //Return access and refresh token
    const accessPayload: IToken = {
      userId: user.id,
      sessionId: session.id,
      role: user.role,
      tokenType: ETokenType.access,
    };

    const refreshPayload: IToken = {
      userId: user.id,
      sessionId: session.id,
      role: user.role,
      tokenType: ETokenType.refresh,
    };

    const tokens = {
      accessToken: this.jwtService.sign(accessPayload, { expiresIn: '1d' }),
      refreshToken: this.jwtService.sign(refreshPayload),
    };

    await this.cacheService.set(`${CACHE_SESSION}:${String(session.id)}`, session.language, CacheTtlSeconds.ONE_DAY);

    return Response.success({ user, tokens });
  }

  async loginSNS(userLoginSNSDto: UserLoginSNSDto): Promise<ISuccessResponse> {
    const userType: string = userLoginSNSDto.userType;
    const socialToken: string = userLoginSNSDto.socialToken;
    let verifyData: IVerifyInfo | any = null;

    switch (userType) {
      case UserType.Google:
        verifyData = await this.firebaseService.authenticate(socialToken);
        break;
      case UserType.Apple:
        verifyData = await this.appleAuthService.authenticate(socialToken);
        break;
      case UserType.Naver:
        verifyData = await this.naverAuthService.authenticate(socialToken);
        break;
      case UserType.Kakao:
        verifyData = await this.kakaoAuthService.authenticate(socialToken);
        break;
      default:
        break;
    }

    if (verifyData?.error) {
      throw Response.unauthorized(AuthErrorMessage.unauthorized());
    }

    verifyData.language = userLoginSNSDto.language;
    verifyData.userType = userType;
    verifyData.deviceToken = userLoginSNSDto.deviceToken;

    const [user, session] = await this.usersService.signInSNS(verifyData);

    //Return access and refresh token
    const accessPayload: IToken = {
      userId: user.id,
      sessionId: session.id,
      role: user.role,
      tokenType: ETokenType.access,
    };

    const refreshPayload: IToken = {
      userId: user.id,
      sessionId: session.id,
      role: user.role,
      tokenType: ETokenType.refresh,
    };

    const tokens = {
      accessToken: this.jwtService.sign(accessPayload, { expiresIn: '1d' }),
      refreshToken: this.jwtService.sign(refreshPayload),
    };

    await this.cacheService.set(`${CACHE_SESSION}:${String(session.id)}`, session.language, CacheTtlSeconds.ONE_DAY);

    return Response.success({ user, tokens });
  }

  async logout(reqUser: IReqUser): Promise<ISuccessResponse> {
    await Promise.all([
      this.cacheService.del(`${CACHE_SESSION}:${String(reqUser.sessionId)}`),
      this.sessionsService.deactivateSession(reqUser.sessionId),
    ]);

    return Response.success();
  }

  async accessToken(reqUser: IReqUser): Promise<ISuccessResponse> {
    const accessPayload: IToken = {
      userId: reqUser.userId,
      sessionId: reqUser.sessionId,
      role: reqUser.role,
      tokenType: ETokenType.access,
    };
    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '1d',
    });

    return Response.success({ accessToken });
  }

  async register(userRegisterDto: UserRegisterDto): Promise<ISuccessResponse> {
    const [user, session] = await this.usersService.register(userRegisterDto);

    //Return access and refresh token
    const accessPayload: IToken = {
      userId: user.id,
      sessionId: session.id,
      role: user.role,
      tokenType: ETokenType.access,
    };

    const refreshPayload: IToken = {
      userId: user.id,
      sessionId: session.id,
      role: user.role,
      tokenType: ETokenType.refresh,
    };

    const tokens = {
      accessToken: this.jwtService.sign(accessPayload, { expiresIn: '1d' }),
      refreshToken: this.jwtService.sign(refreshPayload),
    };

    await this.cacheService.set(`${CACHE_SESSION}:${String(session.id)}`, session.language, CacheTtlSeconds.ONE_DAY);

    return Response.success({ user, tokens });
  }
}
