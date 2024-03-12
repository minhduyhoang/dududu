import { BaseEntityCustom } from "src/utils/entity/BaseEntity";
import { BeforeInsert, BeforeUpdate, Column, Entity, Index } from "typeorm";
import { VERSION_STATUS } from "../versions.constant";

const versionToNum = (version: string) => {
  const versionToArr = version.split(".");

  return Number(
    versionToArr.reduce((old, version) => {
      return (old += version.padStart(3, "0"));
    }, ""),
  );
};

@Entity()
export class Version extends BaseEntityCustom {
  @Index()
  @Column({
    type: "enum",
    enum: VERSION_STATUS,
    default: VERSION_STATUS.ACTIVE,
  })
  status: VERSION_STATUS;

  @Column("varchar")
  version: string;

  @Column("boolean", { default: false })
  forceUpdate: boolean;

  @Column("text", { nullable: true })
  note: string;

  @Index()
  @Column({
    default: 0,
  })
  versionNum: number;

  @Column("simple-array")
  versionArray: number[];

  @Column({
    type: "timestamp",
    nullable: true,
  })
  plannedUpdate: Date;

  @BeforeInsert()
  @BeforeUpdate()
  addVersionNum() {
    this.version = `${this.versionArray[0]}.${this.versionArray[1]}.${this.versionArray[2]}`;
    this.versionNum = versionToNum(this.version);
  }
}
