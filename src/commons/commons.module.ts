import { Module } from "@nestjs/common";
import { CommonsService } from "./commons.service";
import { CommonsController } from "./commons.controller";

@Module({
  controllers: [CommonsController],
  providers: [CommonsService],
})
export class CommonsModule {}
