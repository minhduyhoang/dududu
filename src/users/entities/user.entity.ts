import { instanceToPlain } from "class-transformer";
import { ColumnNumberTransformer } from "src/utils/common/common";
import { BaseEntityCustom } from "src/utils/entity/BaseEntity";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { Sessions } from "../../sessions/entities/session.entity";
import { USER_ROLE, USER_STATUS, USER_TYPE } from "../users.constant";

@Entity({ name: "users" })
export class Users extends BaseEntityCustom {
  @Index()
  @Column({
    type: "enum",
    enum: [USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
    default: USER_ROLE.USER,
  })
  role: USER_ROLE;

  @Index()
  @Column({ type: "enum", enum: USER_STATUS, default: USER_STATUS.ACTIVE })
  status: USER_STATUS;

  @Index()
  @Column({ type: "enum", enum: USER_TYPE, default: USER_TYPE.EMAIL })
  userType: USER_TYPE;

  @Column("varchar", { length: 255, nullable: true })
  email: string;

  @Column("text", { nullable: true })
  name: string;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  dob: Date;

  @Column("varchar", { nullable: true })
  socialId: string;

  @Column("varchar", { nullable: true })
  deviceToken: string;

  @Column("varchar", { length: 65, nullable: true })
  phoneNumber: string;

  @Column("varchar", { length: 255, nullable: true })
  password: string;

  // @Column({ nullable: false, type: 'bigint', default: 0, transformer: new ColumnNumberTransformer() })
  // pointValue: number;

  @OneToMany(() => Sessions, (session) => session.user)
  sessions: Sessions[];

  toJSON() {
    const result = instanceToPlain(this);
    delete result.password;
    return result;
  }
}
