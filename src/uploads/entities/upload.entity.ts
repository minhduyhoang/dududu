import { BaseEntityCustom } from "src/utils/entity/BaseEntity";
import { Column, Entity, Index } from "typeorm";
import { UPLOAD_STATUS } from "../uploads.constant";

@Entity({ name: "uploads" })
export class Uploads extends BaseEntityCustom {
  @Index()
  @Column({ type: "enum", enum: UPLOAD_STATUS, default: UPLOAD_STATUS.ACTIVE })
  status: UPLOAD_STATUS;

  @Column("text", { nullable: true })
  url: string;

  @Column("text", { nullable: true })
  key: string;

  @Column("text", { nullable: true })
  name: string;

  @Column("text", { nullable: true })
  fileType: string;
}
