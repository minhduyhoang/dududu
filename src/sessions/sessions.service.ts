import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheTtlSeconds, CACHE_SESSION } from 'src/cache/cache.constant';
import { CacheService } from 'src/cache/cache.service';
import { USER_ROLE, USER_STATUS } from 'src/users/users.constant';
import { UsersErrorMessage } from 'src/users/users.error';
import { UsersService } from 'src/users/users.service';
import { LANGUAGE } from 'src/utils/constant/constant';
import { IReqUser } from 'src/utils/interface/request.interface';
import { Response } from 'src/utils/interface/response.interface';
import { In, QueryRunner, Repository } from 'typeorm';
import { Users } from '../users/entities/user.entity';
import { SESSION_STATUS } from './sessions.constant';
import { ChangeLanguageDto } from './dto/session.dto';
import { Sessions } from './entities/session.entity';

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
    if (user.status !== USER_STATUS.ACTIVE) {
      throw Response.error(UsersErrorMessage.accountInActive());
    }
    return this.sessionRepository.findOne({
      where: {
        id: sessionId,
        status: SESSION_STATUS.ACTIVE,
      },
    });
  }

  async deactivateSession(sessionId: number): Promise<any> {
    return this.sessionRepository.update(
      { id: sessionId },
      {
        status: SESSION_STATUS.DEACTIVATED,
      }
    );
  }

  async findByUser(user: Users, queryRunner?: QueryRunner): Promise<Sessions> {
    if (queryRunner) {
      return queryRunner.manager.findOne(Sessions, {
        where: {
          user: { id: user.id },
          status: SESSION_STATUS.ACTIVE,
        },
      });
    } else {
      return this.sessionRepository.findOne({
        where: {
          user: { id: user.id },
          status: SESSION_STATUS.ACTIVE,
        },
      });
    }
  }

  async createSession(user: Users, language: LANGUAGE): Promise<Sessions> {
    if (user.role !== USER_ROLE.ADMIN && user.role !== USER_ROLE.SUPER_ADMIN) {
      await this.sessionRepository.update({ user: { id: user.id } }, { status: SESSION_STATUS.REMOVED });
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
    return queryRunner.manager.update(Sessions, { user: { id: In(userIds) } }, { status: SESSION_STATUS.REMOVED });
  }
}
