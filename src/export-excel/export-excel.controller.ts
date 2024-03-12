import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { Auth } from "src/auth/decorators/auth.decorator";
import { ADMIN_PERMISSION } from "src/auth/permissions/permission";
import { ExportExcelService } from "./export-excel.service";

@Controller("export-excels")
export class ExportExcelController {
  constructor(private readonly exportExcelService: ExportExcelService) {}

  @Auth(ADMIN_PERMISSION)
  @Get()
  async exportExcel(@Res() res: Response) {
    let data = [];
    let headers = [
      { name: "a", key: "id" },
      { name: "b", key: "ss" },
      { name: "c", key: "ss" },
      { name: "d", key: "ss" },
      { name: "e", key: "ss" },
      { name: "f", key: "ss" },
      { name: "g", key: "ss" },
    ];

    return this.exportExcelService.export(data, headers, "type", res, 25);
  }
}
