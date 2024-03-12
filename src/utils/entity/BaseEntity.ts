import { instanceToPlain } from "class-transformer";
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  Index,
  Column,
} from "typeorm";

export class BaseEntityCustom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("uuid", { unique: true })
  @Column("varchar", { length: 50, nullable: false, generated: "uuid" })
  uuid: string;

  @Index()
  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  toJSON() {
    const result = instanceToPlain(this);
    return result;
  }
}
