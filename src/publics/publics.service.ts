import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "src/utils/interface/response.interface";
import { CreatePublicDto } from "./dto/create-public.dto";
import { UpdatePublicDto } from "./dto/update-public.dto";

@Injectable()
export class PublicsService {
  constructor(private configService: ConfigService) {}
  get() {
    return Response.success(this.configService.get<string>("GET") || null);
  }
}
