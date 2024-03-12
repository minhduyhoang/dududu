import { Module } from "@nestjs/common";
import { AwsSdkModule } from "nest-aws-sdk";
import { S3 } from "aws-sdk";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AWSService } from "./aws.service";

@Module({
  imports: [
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          endpoint: configService.get<string>("AWS_ENDPOINT"),
          region: configService.get<string>("AWS_REGION"),
          credentials: {
            accessKeyId: configService.get<string>("AWS_ACCESS_KEY"),
            secretAccessKey: configService.get<string>("AWS_SECRET_KEY"),
          },
        }),
        inject: [ConfigService],
      },
      services: [S3],
    }),
  ],
  providers: [AWSService],
  exports: [AWSService],
})
export class AWSModule {}
