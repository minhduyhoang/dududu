import { Module } from "@nestjs/common";
import { PublicsService } from "./publics.service";
import { PublicsController } from "./publics.controller";

@Module({
  controllers: [PublicsController],
  providers: [PublicsService],
  exports: [PublicsService],
})
export class PublicsModule {}
