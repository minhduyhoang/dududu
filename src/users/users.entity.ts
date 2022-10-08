import { instanceToPlain } from 'class-transformer';
import { BaseEntityCustom } from 'src/utils/entity/BaseEntity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Sessions } from '../sessions/sessions.entity';
import { UserRole, UserStatus, UserType } from './users.constant';

@Entity({ name: 'users' })
export class Users extends BaseEntityCustom {
  @Index()
  @Column({
    type: 'enum',
    enum: [UserRole.User, UserRole.Admin, UserRole.SuperAdmin],
    default: UserRole.User,
  })
  role: UserRole;

  @Index()
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Active })
  status: UserStatus;

  @Index()
  @Column({ type: 'enum', enum: UserType, default: UserType.Email })
  userType: UserType;

  @Column('varchar', { length: 255, nullable: true })
  email: string;

  @Column('text', { nullable: true })
  name: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dob: Date;

  @Column('varchar', { nullable: true })
  socialId: string;

  @Column('varchar', { nullable: true })
  deviceToken: string;

  @Column('varchar', { length: 65, nullable: true })
  phoneNumber: string;

  @Column('varchar', { length: 255, nullable: true })
  password: string;

  @OneToMany(() => Sessions, (session) => session.user)
  sessions: Sessions[];

  toJSON() {
    const result = instanceToPlain(this);
    delete result.password;
    return result;
  }
}
