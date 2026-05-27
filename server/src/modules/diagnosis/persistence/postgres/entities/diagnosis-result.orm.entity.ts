import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserOrmEntity } from '../../../../auth/persistence/postgres/entities/user.orm.entity';

@Entity('diagnosis_results')
export class DiagnosisResultOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserOrmEntity;

  @Column({ type: 'jsonb' })
  skills!: { name: string; score: number }[];

  @Column({ type: 'jsonb' })
  answers!: string[];

  @Column({ type: 'int', name: 'average_score' })
  averageScore!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
