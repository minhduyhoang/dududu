import { Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ADMIN_PERMISSION } from 'src/auth/permissions/permission';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ISuccessResponse, Response } from 'src/utils/interface/response.interface';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Auth()
  @Post()
  @UseInterceptors(FileInterceptor('fileUpload', {}))
  async upload(@UploadedFile() fileUpload: Express.Multer.File): Promise<ISuccessResponse> {
    const result = await this.uploadsService.upload(fileUpload);
    return Response.success(result);
  }

  @Auth(ADMIN_PERMISSION)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ISuccessResponse> {
    const result = await this.uploadsService.findById(+id);
    return Response.success(result);
  }

  @Auth(ADMIN_PERMISSION)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ISuccessResponse> {
    await this.uploadsService.remove(+id);
    return Response.success();
  }
}
