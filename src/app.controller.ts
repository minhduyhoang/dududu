import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}
  @Get(["", "ping"])
  ping() {
    return "PONG";
  }
}
