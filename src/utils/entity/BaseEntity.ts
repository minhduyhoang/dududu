import { instanceToPlain } from 'class-transformer';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity, PrimaryGeneratedColumn, Index } from 'typeorm';

export class BaseEntityCustom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  toJSON() {
    const result = instanceToPlain(this);
    return result;
  }
}
