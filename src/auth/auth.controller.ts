import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { UserLoginDto, UserLoginSNSDto, UserRegisterDto } from '../users/users.dto';
import { IRequest } from '../utils/interface/common.interface';
import { AuthService } from './auth.service';
import { JwtRefreshTokenGuard } from './guard/jwt-refresh-token.guard';
import { ANY_PERMISSION } from './permission/permission';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.register(userRegisterDto);
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Post('login-sns')
  async loginSNS(@Body() userLoginSNSDto: UserLoginSNSDto) {
    return this.authService.loginSNS(userLoginSNSDto);
  }

  @Auth(ANY_PERMISSION)
  @Put('logout')
  async logout(@Request() req: IRequest) {
    return this.authService.logout(req.user);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Get('access-token')
  async accessToken(@Request() req: IRequest) {
    return this.authService.accessToken(req.user);
  }

}
