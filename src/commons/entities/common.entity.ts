import { BaseEntityCustom } from "src/utils/entity/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class Common extends BaseEntityCustom {
  @Column("text")
  key: string;

  @Column("text", { nullable: true })
  value: string;
}
