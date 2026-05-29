import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserOrmEntity } from '../../auth/persistence/postgres/entities/user.orm.entity';

@Entity('candidate_evaluations')
export class CandidateEvaluationOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'candidate_user_id' })
  candidateUserId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidate_user_id' })
  candidate!: UserOrmEntity;

  @Column({ name: 'evaluator_user_id' })
  evaluatorUserId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'evaluator_user_id' })
  evaluator!: UserOrmEntity;

  @Column({ name: 'job_id', nullable: true })
  jobId!: string | null;

  @Column({ type: 'int', default: 3 })
  rating!: number;

  @Column({ type: 'text' })
  feedback!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
