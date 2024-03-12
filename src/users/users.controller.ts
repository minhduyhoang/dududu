import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
} from "@nestjs/common";
import {
  IRequest,
  ISuccessResponse,
  Response,
} from "../utils/interface/common.interface";

import { Auth } from "src/auth/decorators/auth.decorator";
import {
  ADMIN_PERMISSION,
  SUPER_ADMIN_PERMISSION,
} from "src/auth/permissions/permission";
import { CacheTtlSeconds, CACHE_PROFILE } from "src/cache/cache.constant";
import { CacheService } from "src/cache/cache.service";
import {
  AdminUpdateUserDto,
  CreateUserDto,
  GetUsersDto,
  UpdateUserDto,
} from "./dto/user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cacheService: CacheService,
  ) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ISuccessResponse> {
    const user = await this.usersService.createUser(createUserDto);
    return Response.success(user);
  }

  @Auth(SUPER_ADMIN_PERMISSION)
  @Post("create-admin")
  async createAdmin(
    @Body() createUserDto: CreateUserDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse> {
    const admin = this.usersService.createAdmin(createUserDto, req.user);
    return Response.success(admin);
  }

  @Auth()
  @Get(["my-profile"])
  myProfile(@Request() req: IRequest): Promise<ISuccessResponse> {
    return this.cacheService.remember(
      `${req.user.language}:${CACHE_PROFILE}:${req.user.userId}`,
      async () => this.usersService.myProfile(req.user),
      CacheTtlSeconds.ONE_HOUR,
    );
  }

  @Get("test")
  test() {
    return this.usersService.test();
  }

  @Auth(ADMIN_PERMISSION)
  @Get()
  findAll(@Query() getUsersDto: GetUsersDto): Promise<ISuccessResponse> {
    return this.usersService.findAll(getUsersDto);
  }

  @Auth(ADMIN_PERMISSION)
  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ISuccessResponse> {
    const user = await this.usersService.findOne(+id);
    return Response.success(user);
  }

  @Auth(ADMIN_PERMISSION)
  @Put(":id")
  async adminUpdateUser(
    @Body() adminUpdateUserDto: AdminUpdateUserDto,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ISuccessResponse> {
    await this.usersService.adminUpdateUser(id, adminUpdateUserDto);
    return Response.success();
  }

  @Auth()
  @Put()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse> {
    await this.usersService.updateUser(req.user, updateUserDto);
    return Response.success();
  }

  @Auth(SUPER_ADMIN_PERMISSION)
  @Delete(":id")
  async adminDeleteUser(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ISuccessResponse> {
    await this.usersService.deleteUser(+id);
    return Response.success();
  }

  @Auth()
  @Delete()
  async deleteUser(@Request() req: IRequest): Promise<ISuccessResponse> {
    await this.usersService.deleteUser(req.user.userId);
    return Response.success();
  }
}
