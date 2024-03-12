import { CanActivate, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { IReqUser } from "src/utils/interface/request.interface";

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(" ")[1];
    try {
      const reqUser: IReqUser = this.jwtService.verify(bearerToken, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });
      return new Promise((resolve, reject) => {
        return this.usersService.myProfile(reqUser).then((user) => {
          if (user) {
            resolve(user);
          } else {
            reject(false);
          }
        });
      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
