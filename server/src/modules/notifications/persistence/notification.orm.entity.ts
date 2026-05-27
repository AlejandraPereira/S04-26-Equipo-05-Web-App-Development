import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserOrmEntity } from '../../auth/persistence/postgres/entities/user.orm.entity';

export type NotificationType = 'application' | 'status_change' | 'evaluation' | 'system';

@Entity('notifications')
export class NotificationOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserOrmEntity;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'varchar', length: 50, default: 'system' })
  type!: NotificationType;

  @Column({ type: 'boolean', default: false })
  read!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
