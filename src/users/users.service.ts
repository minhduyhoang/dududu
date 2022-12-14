import { ForbiddenException, Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, In, Not, QueryRunner, Repository } from 'typeorm';
import { CACHE_PROFILE, CACHE_SESSION } from 'src/cache/cache.constant';
import { CacheService } from 'src/cache/cache.service';
import { Condition } from 'src/utils/interface/condition.interface';
import { Sessions } from '../sessions/sessions.entity';
import { SessionsService } from '../sessions/sessions.service';
import { IReqUser, ISuccessResponse, Pagination, Response } from '../utils/interface/common.interface';
import { AdminUpdateUserDto, CreateUserDto, GetUsersDto, UpdateUserDto, UserLoginDto, UserRegisterDto } from './users.dto';
import { Users } from './users.entity';
import { UsersErrorMessage } from './users.error';
import { UserRole, UserStatus } from './users.constant';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @Inject(forwardRef(() => SessionsService))
    private sessionService: SessionsService,
    private readonly cacheService: CacheService,
    private dataSource: DataSource
  ) {}

  async signIn(userLoginDto: UserLoginDto): Promise<[Users, Sessions]> {
    let role: any = userLoginDto.role;

    if (userLoginDto.role === UserRole.Admin) {
      role = In([UserRole.Admin, UserRole.SuperAdmin]);
    }

    const user = await this.userRepository.findOne({
      where: {
        email: userLoginDto.email,
        role,
        status: Not(UserStatus.Removed),
      },
    });

    if (!user) {
      throw Response.error(UsersErrorMessage.accountNotExist());
    }

    if (user.status !== UserStatus.Active) {
      throw Response.error(UsersErrorMessage.accountInActive());
    }

    const isMatch = await bcrypt.compare(userLoginDto.password, user.password);

    if (!isMatch) {
      throw Response.error(UsersErrorMessage.incorrectPassword());
    }

    if (user.role !== UserRole.Admin && user.role !== UserRole.SuperAdmin) {
      const activeSession = await this.sessionService.findByUser(user);

      if (activeSession) {
        await Promise.all([
          this.sessionService.deactivateSession(activeSession.id),
          this.cacheService.del(`${CACHE_SESSION}:${String(activeSession.id)}`),
        ]);
      }
    }

    if (userLoginDto.deviceToken) {
      await this.userRepository.update(
        { id: user.id },
        {
          deviceToken: userLoginDto.deviceToken,
        }
      );
    }

    const session = await this.sessionService.createSession(user, userLoginDto.language);

    return [user, session];
  }

  async signInSNS({ socialId, userType, language, deviceToken }): Promise<[Users, Sessions]> {
    let user = await this.userRepository.findOne({
      where: { socialId, userType, role: UserRole.User, status: Not(UserStatus.Removed) },
    });

    if (!user) {
      user = this.userRepository.create({
        socialId,
        userType,
        deviceToken,
      });
      await this.userRepository.save(user);
    } else {
      if (deviceToken) {
        await this.userRepository.update({ id: user.id }, { deviceToken });
      }
    }

    if (user.status !== UserStatus.Active) {
      throw Response.error(UsersErrorMessage.accountInActive());
    }

    const activeSession = await this.sessionService.findByUser(user);

    if (activeSession) {
      await Promise.all([
        this.sessionService.deactivateSession(activeSession.id),
        this.cacheService.del(`${CACHE_SESSION}:${String(activeSession.id)}`),
      ]);
    }

    const session = await this.sessionService.createSession(user, language);
    return [user, session];
  }

  async findAll(getUsersDto: GetUsersDto): Promise<ISuccessResponse> {
    const page = getUsersDto.page;
    const limit = getUsersDto.limit;
    const order = getUsersDto.order;
    const skip = (page - 1) * limit;

    const conditions = Condition.create(getUsersDto);

    if (getUsersDto.role) {
      conditions['role'] = getUsersDto.role;
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: conditions,
      take: limit,
      skip: skip,
      order: { createdAt: order },
    });

    const result = Pagination.create(users, total, page, limit);
    return Response.success(result);
  }

  async findOne(id: number): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        id,
        status: Not(UserStatus.Removed),
      },
    });

    if (!user) {
      throw Response.error(UsersErrorMessage.userNotFound({ id }));
    }

    return user;
  }

  async myProfile(reqUser: IReqUser): Promise<ISuccessResponse> {
    const user = await this.userRepository.findOne({ where: { id: reqUser.userId } });
    return Response.success(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const checkExistEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
        status: Not(UserStatus.Removed),
      },
    });

    if (checkExistEmail) {
      throw Response.error(UsersErrorMessage.emailAlreadyExist());
    }

    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async register(userRegisterDto: UserRegisterDto): Promise<[Users, Sessions]> {
    const checkExistEmail = await this.userRepository.findOne({
      where: {
        email: userRegisterDto.email,
        status: Not(UserStatus.Removed),
      },
    });

    if (checkExistEmail) {
      throw Response.error(UsersErrorMessage.emailAlreadyExist());
    }

    const user = this.userRepository.create(userRegisterDto);
    await this.userRepository.save(user);

    const session = await this.sessionService.createSession(user, userRegisterDto.language);
    return [user, session];
  }

  async updateUser(reqUser: IReqUser, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id: reqUser.userId,
        status: Not(UserStatus.Removed),
      },
    });

    if (!user) {
      throw Response.error(UsersErrorMessage.userNotFound());
    }

    if (updateUserDto.email) {
      const checkExistEmail = await this.userRepository.findOne({
        where: {
          id: Not(reqUser.userId),
          email: updateUserDto.email,
          status: Not(UserStatus.Removed),
        },
      });
      if (checkExistEmail) {
        throw Response.error(UsersErrorMessage.emailAlreadyExist());
      }
    }

    if (updateUserDto.phoneNumber) {
      const checkDuplicatePhoneNumber = await this.userRepository.findOne({
        where: {
          id: Not(reqUser.userId),
          phoneNumber: updateUserDto.phoneNumber,
          status: Not(UserStatus.Removed),
        },
      });
      if (checkDuplicatePhoneNumber) {
        throw Response.error(UsersErrorMessage.phoneNumberAlreadyExist());
      }
    }

    await Promise.all([this.userRepository.update({ id: reqUser.userId }, updateUserDto), this.cacheService.clearCacheByPattern(CACHE_PROFILE)]);
  }

  async adminUpdateUser(id: number, adminUpdateUserDto: AdminUpdateUserDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id,
        status: Not(UserStatus.Removed),
      },
    });

    if (!user) {
      throw Response.error(UsersErrorMessage.userNotFound());
    }

    if (adminUpdateUserDto.email) {
      const checkExistEmail = await this.userRepository.findOne({
        where: {
          id: Not(id),
          email: adminUpdateUserDto.email,
          status: Not(UserStatus.Removed),
        },
      });

      if (checkExistEmail) {
        throw Response.error(UsersErrorMessage.emailAlreadyExist());
      }
    }

    if (adminUpdateUserDto.phoneNumber) {
      const checkDuplicatePhoneNumber = await this.userRepository.findOne({
        where: {
          id: Not(id),
          phoneNumber: adminUpdateUserDto.phoneNumber,
          status: Not(UserStatus.Removed),
        },
      });

      if (checkDuplicatePhoneNumber) {
        throw Response.error(UsersErrorMessage.phoneNumberAlreadyExist());
      }
    }

    if (adminUpdateUserDto.password) {
      const salt = await bcrypt.genSalt();
      adminUpdateUserDto.password = await bcrypt.hash(adminUpdateUserDto.password, salt);
    }

    await Promise.all([this.userRepository.update({ id }, adminUpdateUserDto), this.cacheService.clearCacheByPattern(CACHE_PROFILE)]);
  }

  async getOne(id: number): Promise<Users> {
    return this.userRepository.findOne({
      where: {
        id,
        status: Not(UserStatus.Removed),
      },
    });
  }

  async findById(id: number, queryRunner?: QueryRunner): Promise<Users> {
    let user: Users;
    if (queryRunner) {
      user = await queryRunner.manager.findOne(Users, {
        where: {
          id,
          status: UserStatus.Active,
        },
      });
    } else {
      user = await this.userRepository.findOne({
        where: {
          id,
          status: UserStatus.Active,
        },
      });
    }

    if (!user) throw Response.error(UsersErrorMessage.userNotFound());
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(Users, {
        where: {
          id,
          status: UserStatus.Active,
          role: Not(UserRole.SuperAdmin),
        } as any,
      });

      if (!user) throw Response.error(UsersErrorMessage.userNotFound());

      const [session, update] = await Promise.all([this.sessionService.findByUser(user, queryRunner), queryRunner.manager.softDelete(Users, id)]);

      if (session) {
        await Promise.all([this.cacheService.del(`${CACHE_SESSION}:${String(session.id)}`), this.sessionService.deactivateSession(session.id)]);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createAdmin(createUserDto: CreateUserDto, reqUser: IReqUser): Promise<Users> {
    const superAdmin = await this.userRepository.findOne({
      where: {
        id: reqUser.userId,
        status: UserStatus.Active,
      },
    });

    if (!superAdmin || superAdmin.role !== UserRole.SuperAdmin) {
      throw new ForbiddenException();
    }

    const checkExistEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
        status: Not(UserStatus.Removed),
      },
    });

    if (checkExistEmail) {
      throw Response.error(UsersErrorMessage.emailAlreadyExist());
    }

    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const admin = this.userRepository.create({
      ...createUserDto,
      role: UserRole.Admin,
    });

    return this.userRepository.save(admin);
  }
}
