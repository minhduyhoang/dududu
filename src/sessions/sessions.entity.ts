import { Entity, Column, Index, ManyToOne } from 'typeorm';
import { Users } from '../users/users.entity';
import { Language } from 'src/utils/constant/language.constant';
import { BaseEntityCustom } from 'src/utils/entity/BaseEntity';
import { SessionStatus } from './sessions.constant';

@Entity({ name: 'sessions' })
export class Sessions extends BaseEntityCustom {
  @Column({ type: 'enum', enum: Language, default: Language.En })
  language: Language;

  @Index()
  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.Active })
  status: SessionStatus;

  @ManyToOne(() => Users, (user) => user.sessions)
  user: Users;
}
