import { Entity, Column, Index, ManyToOne } from "typeorm";
import { Users } from "../../users/entities/user.entity";
import { LANGUAGE } from "src/utils/constant/constant";
import { BaseEntityCustom } from "src/utils/entity/BaseEntity";
import { SESSION_STATUS } from "../sessions.constant";

@Entity({ name: "sessions" })
export class Sessions extends BaseEntityCustom {
  @Column({ type: "enum", enum: LANGUAGE, default: LANGUAGE.EN })
  language: LANGUAGE;

  @Index()
  @Column({
    type: "enum",
    enum: SESSION_STATUS,
    default: SESSION_STATUS.ACTIVE,
  })
  status: SESSION_STATUS;

  @ManyToOne(() => Users, (user) => user.sessions)
  user: Users;
}
