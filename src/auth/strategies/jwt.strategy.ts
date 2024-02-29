import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CacheTtlSeconds, CACHE_SESSION } from 'src/cache/cache.constant';

import { CacheService } from 'src/cache/cache.service';
import { SessionsService } from '../../sessions/sessions.service';
import { ICache, IReqUser, Response } from '../../utils/interface/common.interface';
import { AuthErrorMessage } from '../auth.error';
import { ETokenType, IToken } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private sessionsService: SessionsService, private cacheService: CacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(token: IToken): Promise<IReqUser> {
    if (token.tokenType !== ETokenType.access || !token?.sessionId) {
      throw Response.unauthorized(AuthErrorMessage.invalidAccessToken());
    }
    //Check Redis, if not then check database

    const cache: ICache = await this.cacheService.get(String(token.sessionId));
    let language = cache;

    if (!cache) {
      const session = await this.sessionsService.findBySessionId(token.sessionId, token.userId);

      if (!session) {
        throw Response.unauthorized(AuthErrorMessage.sessionExpired());
      }

      await this.cacheService.set(`${CACHE_SESSION}:${String(session.id)}`, session.language, CacheTtlSeconds.ONE_DAY);

      language = session.language;
    }

    return {
      userId: token.userId,
      sessionId: token.sessionId,
      role: token.role,
      language,
    };
  }
}
