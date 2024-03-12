import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { PublicsService } from "./publics.service";
import { CreatePublicDto } from "./dto/create-public.dto";
import { UpdatePublicDto } from "./dto/update-public.dto";

@Controller("publics")
export class PublicsController {
  constructor(private readonly publicsService: PublicsService) {}

  @Get("")
  get() {
    return this.publicsService.get();
  }
}
