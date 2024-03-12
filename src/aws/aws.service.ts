import { Injectable } from "@nestjs/common";
import { InjectAwsService } from "nest-aws-sdk";
import { S3 } from "aws-sdk";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AWSService {
  constructor(
    private configService: ConfigService,
    @InjectAwsService(S3) private readonly s3: S3,
  ) {
    // this.checkConnection()
  }

  async checkConnection() {
    this.s3.listBuckets((err, data) => {
      if (err) {
        console.log("AWS INIT ERROR: ", err);
        throw err;
        //throw error aws connection error
      } else {
        //Get list of required bucket
        const requiredBuckets = [
          this.configService.get<string>("AWS_BUCKET_NAME"),
        ];
        //Initialize bucket check existed object
        const bucketChecks = {};
        requiredBuckets.map((bucketName) => {
          bucketChecks[bucketName] = "required";
        });
        //Get list of current buckets on AWS account
        let bucketList = data.Buckets.map((bucket) => {
          return bucket.Name;
        });
        //Check if required buckets are existed or not
        bucketList.map((bucketName) => {
          if (bucketChecks[bucketName] === "required")
            bucketChecks[bucketName] = "existed";
        });
        //notice missing buckets
        for (const key in bucketChecks) {
          if (bucketChecks[key] === "required") {
            throw bucketChecks;
          }
        }
        console.log("bucketChecks", bucketChecks);
      }
    });
  }

  truncateString(text: string = "") {
    text = text.toLowerCase();
    text = text.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, "");
    text = text.replace(/^-*|-*$|(-)-*/g, "$1");
    return text;
  }

  public async uploadFile(
    file: any,
    key: string,
    bucket: string = this.configService.get<string>("AWS_BUCKET_NAME"),
  ): Promise<any> {
    try {
      if (!file || !key) return true;
      const params: S3.PutObjectRequest = {
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ACL: "public-read",
        ContentType: file.mimetype,
      };

      return this.s3.upload(params).promise();
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async deleteFile(
    key: string,
    bucket: string = this.configService.get<string>("AWS_BUCKET_NAME"),
  ): Promise<any> {
    try {
      if (!key) return true;
      const params: S3.DeleteObjectRequest = { Bucket: bucket, Key: key };
      return this.s3.deleteObject(params).promise();
    } catch (error) {
      return false;
    }
  }

  public async getFile(key: string, bucket?: string): Promise<any> {
    try {
      if (!bucket) bucket = this.configService.get<string>("AWS_BUCKET_NAME");
      if (!key) return true;
      const params: S3.GetObjectRequest = { Bucket: bucket, Key: key };
      return this.s3.getObject(params).promise();
    } catch (error) {
      return false;
    }
  }
}
