import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AWSService } from 'src/aws/aws.service';
import { Response } from 'src/utils/interface/response.interface';
import { QueryRunner, Repository } from 'typeorm';
import { UploadStatus, FolderConstant } from './uploads.constant';
import { Uploads } from './uploads.entity';
import { UploadsErrorMessage } from './uploads.error';

@Injectable()
export class UploadsService {
  constructor(@InjectRepository(Uploads) private uploadsRepository: Repository<Uploads>, private awsService: AWSService) {}

  truncateString(text: string = '') {
    text = text.toLowerCase();
    text = text.replace(/[&\/\\#, +()$~%'":*?<>{}]/g, '');
    text = text.replace(/^-*|-*$|(-)-*/g, '$1');
    return text;
  }

  async upload(fileUpload: Express.Multer.File, folder: FolderConstant = FolderConstant.Common, queryRunner?: QueryRunner): Promise<Uploads> {
    const fileName = this.awsService.truncateString(fileUpload.originalname);
    const key: string = `${folder}/${new Date().getUTCFullYear()}/${new Date().getUTCMonth() + 1}/${Date.now()}-${fileName}`;

    const result = await this.awsService.uploadFile(fileUpload, key);
    if (!result) throw Response.error(UploadsErrorMessage.uploadFailed());

    const data = this.uploadsRepository.create({
      url: result.Location,
      key,
      name: fileUpload.originalname,
      fileType: fileUpload?.mimetype,
    });

    if (queryRunner) {
      queryRunner.manager.save(data);
    } else {
      await this.uploadsRepository.save(data);
    }

    return data;
  }

  async findById(id: number, queryRunner?: QueryRunner): Promise<Uploads> {
    let fileUpload;
    if (queryRunner) {
      fileUpload = await queryRunner.manager.findOne(Uploads, {
        where: {
          id,
          status: UploadStatus.Active,
        },
      });
    } else {
      fileUpload = await this.uploadsRepository.findOne({
        where: {
          id,
          status: UploadStatus.Active,
        },
      });
    }

    if (!fileUpload) {
      throw Response.error(UploadsErrorMessage.notFound());
    }

    return fileUpload;
  }

  async remove(id: number): Promise<void> {
    const fileUpload = await this.uploadsRepository.findOne({
      where: {
        id,
        status: UploadStatus.Active,
      },
    });

    if (fileUpload) {
      await Promise.all([
        this.awsService.deleteFile(fileUpload.key),
        this.uploadsRepository.softDelete(id),
      ]);
    }
  }
}
