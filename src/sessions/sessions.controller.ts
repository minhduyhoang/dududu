import { Body, Controller, Put, Request } from '@nestjs/common';
import { IRequest } from 'src/utils/interface/request.interface';
import { ISuccessResponse, Response } from 'src/utils/interface/response.interface';
import { ChangeLanguageDto } from './dto/session.dto';
import { SessionsService } from './sessions.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ANY_PERMISSION } from 'src/auth/permissions/permission';

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Auth(ANY_PERMISSION)
  @Put('language')
  async changeLanguage(@Body() changeLanguageDto: ChangeLanguageDto, @Request() req: IRequest): Promise<ISuccessResponse> {
    await this.sessionsService.changeLanguage(req.user, changeLanguageDto);
    return Response.success();
  }
}
