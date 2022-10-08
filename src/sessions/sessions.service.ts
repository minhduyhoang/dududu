import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheTtlSeconds, CACHE_SESSION } from 'src/cache/cache.constant';
import { CacheService } from 'src/cache/cache.service';
import { UserRole, UserStatus } from 'src/users/users.constant';
import { UsersErrorMessage } from 'src/users/users.error';
import { UsersService } from 'src/users/users.service';
import { Language } from 'src/utils/constant/language.constant';
import { IReqUser } from 'src/utils/interface/request.interface';
import { Response } from 'src/utils/interface/response.interface';
import { In, QueryRunner, Repository } from 'typeorm';
import { Users } from '../users/users.entity';
import { SessionStatus } from './sessions.constant';
import { ChangeLanguageDto } from './sessions.dto';
import { Sessions } from './sessions.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Sessions)
    private sessionRepository: Repository<Sessions>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private cacheService: CacheService
  ) {}
  async findBySessionId(sessionId: number, userId: number): Promise<Sessions> {
    const user = await this.usersService.getOne(userId);

    if (!user) {
      throw Response.error(UsersErrorMessage.userNotFound());
    }
    if (user.status !== UserStatus.Active) {
      throw Response.error(UsersErrorMessage.accountInActive());
    }
    return this.sessionRepository.findOne({
      where: {
        id: sessionId,
        status: SessionStatus.Active,
      },
    });
  }

  async deactivateSession(sessionId: number): Promise<any> {
    return this.sessionRepository.update(
      { id: sessionId },
      {
        status: SessionStatus.Deactivated,
      }
    );
  }

  async findByUser(user: Users, queryRunner?: QueryRunner): Promise<Sessions> {
    if (queryRunner) {
      return queryRunner.manager.findOne(Sessions, {
        where: {
          user: { id: user.id },
          status: SessionStatus.Active,
        },
      });
    } else {
      return this.sessionRepository.findOne({
        where: {
          user: { id: user.id },
          status: SessionStatus.Active,
        },
      });
    }
  }

  async createSession(user: Users, language: Language): Promise<Sessions> {
    if (user.role !== UserRole.Admin && user.role !== UserRole.SuperAdmin) {
      await this.sessionRepository.update({ user: { id: user.id } }, { status: SessionStatus.Removed });
    }
    return this.sessionRepository.save({ user, language });
  }

  async changeLanguage(reqUser: IReqUser, changeLanguageDto: ChangeLanguageDto): Promise<void> {
    await Promise.all([
      this.cacheService.set(`${CACHE_SESSION}:${String(reqUser.sessionId)}`, changeLanguageDto.language, CacheTtlSeconds.ONE_DAY),
      this.sessionRepository.update(
        {
          id: reqUser.sessionId,
        },
        changeLanguageDto
      ),
    ]);
  }

  async removeByUserIds(userIds: number[], queryRunner: QueryRunner) {
    return queryRunner.manager.update(Sessions, { user: { id: In(userIds) } }, { status: SessionStatus.Removed });
  }
}
